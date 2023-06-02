import type { ActionArgs, LinksFunction } from "@remix-run/node"
import { Link, useActionData, useSearchParams } from "@remix-run/react"

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

type FieldErrors = {
  phoneNumber?: string | undefined
  verificationCode?: string | undefined
}

export const action = async ({ request }: any) => {
  const form = await request.formData()
  const state = form.get("state")

  const phoneNumber = form.get("phoneNumber")
  const fieldErrors: FieldErrors = {
    phoneNumber: phoneNumber ? validatePhoneNumber(phoneNumber) : undefined,
  }
  if (typeof phoneNumber !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    })
  }
  console.log("pn is", phoneNumber)

  const fields = { phoneNumber }

  let user = await db.user.findUnique({
    where: {
      phoneNumber: phoneNumber,
    },
  })

  if (state === "verification") {
    if (!user) {
      fieldErrors.verificationCode = "internal error"
      return badRequest({
        fieldErrors,
        fields,
        formError: null,
      })
    }
    const submittedCode: String = form.get("verification")
    const redirectTo = validateUrl((form.get("redirectTo") as string) || "/ggg")

    console.log("heyy", user.verificationCode!, submittedCode)

    if (user.verificationCode! !== submittedCode) {
      fieldErrors.verificationCode = "verification code wrong"
    }

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({
        fieldErrors,
        fields,
        formError: null,
      })
    }
    return createUserSession(user.phoneNumber, redirectTo)
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    })
  }

  if (!user) {
    user = await db.user.create({
      data: {
        phoneNumber: phoneNumber,
      },
    })
  }

  // console.log("hhhhhh")

  console.log(user)
  const isSuspended = user.isSuspended

  const verificationCode = getRandomString(1000, 9999) // 4 figures
  const verificationCodeExpiry = new Date(
    new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + 5),
  )

  console.log(user)

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

type State = "phoneNumber" | "verification"

export default function Login() {
  const actionData = useActionData()
  const [searchParams] = useSearchParams()

  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState<String>("")

  const [state, setState] = useState<State>("phoneNumber")

  useEffect(() => {
    if (state === "phoneNumber" && actionData?.codeSent)
      setState("verification")
  }, [actionData?.codeSent])

  useEffect(() => {
    if (state === "verification")
      setPhoneNumber(sessionStorage.getItem("phoneNumber")!)
  }, [verificationCode])

  useEffect(() => {
    if (state === "phoneNumber") {
      if (phoneNumber == "") {
        return
      }
      sessionStorage.setItem("phoneNumber", phoneNumber)
    }
  }, [phoneNumber])

  // console.log(phoneNumber,actionData)

  return (
    <div>
      <h1>Login</h1>
      <form method="post">
        {state === "phoneNumber" ? (
          <>
            <label htmlFor="phoneNumber">phone number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue=""
              placeholder="09******"
              aria-invalid={Boolean(actionData?.fieldErrors?.phoneNumber)}
              aria-errormessage={
                actionData?.fieldErrors?.phoneNumber
                  ? "Phone number error"
                  : undefined
              }
              onChange={e => {
                e.preventDefault()
                if (e.target.value) {
                  setPhoneNumber(e.target.value)
                }
              }}
            />
            <input type="hidden" name="state" value={"phoneNumber"} />

            {actionData?.fieldErrors?.phoneNumber ? (
              <p className="form-validation-error" role="alert">
                {actionData.fieldErrors.phoneNumber}
              </p>
            ) : null}
            <div>
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData.formError}
                </p>
              ) : null}
            </div>
            <div>
              <button type="submit" className="button">
                Submit
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />

            <input type="hidden" name="phoneNumber" value={phoneNumber} />
            <input type="hidden" name="state" value={"verification"} />

            <label htmlFor="verification">verification code</label>
            <input
              type="text"
              id="verification"
              name="verification"
              defaultValue=""
              placeholder="1234"
              aria-invalid={Boolean(actionData?.fieldErrors?.verificationCode)}
              aria-errormessage={
                actionData?.fieldErrors?.verificationCode
                  ? "verification code error"
                  : undefined
              }
              onChange={e => {
                e.preventDefault()
                if (e.target.value) {
                  setVerificationCode(e.target.value)
                }
              }}
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
            <button type="submit" className="button">
              Submit
            </button>
          </>
        )}
      </form>
      <div id="form-error-message">
        {actionData?.formError ? (
          <p className="form-validation-error" role="alert">
            {actionData.formError}
          </p>
        ) : null}
      </div>
    </div>
  )
}
