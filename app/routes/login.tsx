import type { ActionArgs, LinksFunction } from "@remix-run/node"
import { Link, useActionData, useSearchParams } from "@remix-run/react"
import { createSecureServer } from "http2"

import { useEffect, useState } from "react"

import { db } from "~/utils/db.server"
import { badRequest } from "~/utils/request.server"
import { createUserSession } from "~/utils/session.server"

// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: stylesUrl },
// ]

function validatePhoneNumber(phoneNumber: string) {
  if (phoneNumber?.length != 11) {
    return "PhoneNumber must only be 11 characters long"
  }
}

function getRandomString(min: number, max: number): string {
  min = Math.ceil(min)
  max = Math.floor(max)
  return String(Math.floor(Math.random() * (max - min) + min))
}

function validateUrl(url: string) {
  const urls = ["/home", "/", "/stores"]
  if (urls.includes(url)) {
    return url
  }
  return "/"
}

export const action = async ({ request }: any) => {
  const form = await request.formData()
  const phoneNumber = form.get("phoneNumber")
  const state = form.get("state")
  const fieldErrors = {
    phoneNumber: validatePhoneNumber(phoneNumber),
  }
  if (typeof phoneNumber !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    })
  }

  const fields = { phoneNumber }

  let user = await db.user.findUnique({
    where: {
      phoneNumber: phoneNumber,
    },
  })

  if (!user) {
    user = await db.user.create({
      data: {
        phoneNumber: phoneNumber,
      },
    })
  }

  if (state === "verification") {
    const submittedCode: String = form.get("verification")
    const redirectTo = validateUrl((form.get("redirectTo") as string) || "/ggg")

    if (user.verificationCode! !== submittedCode) {
      const fieldErrors = {
        verificationCode: true,
      }
    }

    console.log("ooo")
    return createUserSession(user.phoneNumber, redirectTo)

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({
        fieldErrors,
        fields,
        formError: null,
      })
    }
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    })
  }

  console.log("hhhhhh")

  console.log(user)
  const isSuspended = user.isSuspended

  const verificationCode = getRandomString(1000, 9999) // 4 figures
  const verificationCodeExpiry = new Date(
    new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + 5),
  )

  await db.user.update({
    where: {
      phoneNumber: phoneNumber,
    },
    data: {
      verificationCode,
      verificationCodeExpiry,
    },
  })

  return {
    codeSent: true,
  }
}

export default function Login() {
  const actionData = useActionData()
  const [searchParams] = useSearchParams()

  const [phoneNumber, setPhoneNumber] = useState<String>("")

  const [state, setState] = useState<"phoneNumber" | "verification">(
    "phoneNumber",
  )
  console.log(actionData)

  useEffect(() => {
    if (state === "phoneNumber" && actionData?.codeSent)
      setState("verification")
  }, [actionData?.codeSent])

  return (
    <div>
      <h1>Login</h1>
      {state === "phoneNumber" ? (
        <>
          <form method="post">
            <label htmlFor="phoneNumber">phone number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue=""
              placeholder="090******"
              // aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              // aria-errormessage={
              //   actionData?.fieldErrors?.username ? "username-error" : undefined
              // }
              onChange={e => {
                e.preventDefault()
                setPhoneNumber(e.target.value)
              }}
            />
            {actionData?.fieldErrors?.phoneNumber ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.phoneNumber}
              </p>
            ) : null}
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <div
            // onClick={() => {
            //   if (state === "phoneNumber" && actionData?.codeSent)
            //     setState("verification")
            // }}
            >
              <button type="submit" className="button">
                Submit
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          {" "}
          <form method="post">
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />

            <input
              type="hidden"
              name="phoneNumber"
              value={String(phoneNumber)}
            />

            <input type="hidden" name="state" value={"verification"} />

            <label htmlFor="verification">verification code</label>
            <input
              type="text"
              id="verification"
              name="verification"
              defaultValue=""
              placeholder="1234"
              // aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              // aria-errormessage={
              //   actionData?.fieldErrors?.username ? "username-error" : undefined
              // }
            />
            {actionData?.fieldErrors?.verificationCode ? (
              <p
                className="form-validation-error"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.verificationCode}
              </p>
            ) : null}
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
