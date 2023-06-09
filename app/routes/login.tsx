import { useEffect, useState } from "react"
import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react"
import {
  createOrUpdateUser,
  getUserByPhone,
  updateVerificationCode,
} from "~/utils/user.query.server"
import { calculateOrder } from "~/utils/order.query.server"
import { badRequest } from "~/utils/request.server"
import { createUserSession } from "~/utils/session.server"
import { LoaderArgs } from "@remix-run/server-runtime"
import { Form } from "@remix-run/react"

const ALLOWED_PHONE_PREFIX = "09"
const VERIFICATION_CODE_FIGURES = 4
const VERIFICATION_CODE_EXPIRY_TIME = 5
const ALLOWED_URLS = ["/home", "/", "/stores", "/orders", "/login"]

function validatePhoneNumber(phoneNumber: string) {
  if (
    phoneNumber?.length != 11 ||
    !phoneNumber.match(/\d{11}/) ||
    !Boolean(parseInt(phoneNumber)) ||
    !phoneNumber.startsWith(ALLOWED_PHONE_PREFIX)
  ) {
    return "Wrong PhoneNumber Format"
  }
}

function generateVerificationCode(figures: number) {
  const mins = [1]
  const maxs = [9]

  for (let index = 0; index < figures - 1; index++) {
    mins.push(0)
    maxs.push(9)
  }

  let min = Number(mins.join(""))
  let max = Number(maxs.join(""))

  min = Math.ceil(min)
  max = Math.floor(max)

  return String(Math.floor(Math.random() * (max - min) + min))
}

function generateVerificationExpiry(mins: number): Date {
  const defaultMinutes = 4
  mins = mins ?? defaultMinutes

  return new Date(
    new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + mins),
  )
}

function validateUrl(url: string, urls: string[]) {
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
  const state: string | undefined = form.get("state")
  const submittedphone: string | undefined = form.get("phoneNumber")(
    "price",
    await calculateOrder({ orderId: 1 }),
  )

  const fieldErrors: FieldErrors = {
    phoneNumber: submittedphone
      ? validatePhoneNumber(submittedphone)
      : undefined,
  }

  if (typeof submittedphone !== "string" || !state) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form Not Submitted Correctly.",
    })
  }

  if (fieldErrors.phoneNumber) {
    return {
      fieldErrors,
    }
  }

  const fields = { phoneNumber: submittedphone }

  let user
  try {
    user = await getUserByPhone({ phoneNumber: submittedphone })
  } catch {
    return {
      formError: "Internal Error",
    }
  }

  if (state === "verification") {
    if (!user) {
      return {
        formError: "Internal Error",
      }
    }

    const submittedCode: String = form.get("verification")

    if (typeof submittedCode !== "string" || !submittedCode) {
      return badRequest({
        fieldErrors: null,
        fields: null,
        formError: "Form Not Submitted Correctly.",
      })
    }

    const redirectTo = validateUrl(
      (form.get("redirectTo") as string) || "/home",
      ALLOWED_URLS,
    )

    if (
      user.verificationCode! !== submittedCode ||
      user.verificationCodeExpiry! < new Date(Date.now())
    ) {
      fieldErrors.verificationCode = "Verification Code Wrong, Try Again"
    }

    if (Object.values(fieldErrors).some(Boolean)) {
      return {
        fieldErrors,
        fields,
        formError: null,
        state: "verification",
      }
    }

    return createUserSession(user.phoneNumber, redirectTo)
  }

  if (!user) {
    try {
      user = await createOrUpdateUser({ phoneNumber: submittedphone })
    } catch {
      return {
        formError: "Internal Error",
      }
    }
  }

  if (user.isSuspended) {
    fieldErrors.phoneNumber = "User Is Suspended"
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return {
      fieldErrors,
    }
  }

  const verificationCode = generateVerificationCode(VERIFICATION_CODE_FIGURES)
  const verificationCodeExpiry = generateVerificationExpiry(
    VERIFICATION_CODE_EXPIRY_TIME,
  )

  try {
    user = await updateVerificationCode(
      submittedphone,
      verificationCode,
      verificationCodeExpiry,
    )
  } catch {
    return {
      formError: "Internal Error",
    }
  }

  return {
    codeSent: true,
  }
}

type State = "phoneNumber" | "verification"

export default function Login() {
  const actionData = useActionData()
  // const loaderData = useLoaderData<typeof loader>()
  const loaderData = { isLoggedIn: false }

  const [searchParams] = useSearchParams()

  const [phoneNumber, setPhoneNumber] = useState<string>("")

  const [verificationCode, setVerificationCode] = useState<String>("")

  const [state, setState] = useState<State>(actionData?.state ?? "phoneNumber")

  // (phoneNumber,"ph", );

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

  return (
    <div>
      <h1>Login</h1>
      {loaderData.isLoggedIn ? (
        <p>Already Logged In</p>
      ) : (
        <>
          <Form method="post">
            {state === "phoneNumber" ? (
              <>
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  defaultValue=""
                  placeholder="09******"
                  aria-invalid={Boolean(actionData?.fieldErrors?.phoneNumber)}
                  aria-errormessage={
                    actionData?.fieldErrors?.phoneNumber
                      ? "Phone Number Error"
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
                  <p role="alert">{actionData.fieldErrors.phoneNumber}</p>
                ) : null}
                <div>
                  {actionData?.formError ? (
                    <p role="alert">{actionData.formError}</p>
                  ) : null}
                </div>
                <div>
                  <button type="submit">Submit</button>
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

                <label htmlFor="verification">Verification Code</label>
                <input
                  type="text"
                  id="verification"
                  name="verification"
                  defaultValue=""
                  placeholder="1234"
                  aria-invalid={Boolean(
                    actionData?.fieldErrors?.verificationCode,
                  )}
                  aria-errormessage={
                    actionData?.fieldErrors?.verificationCode
                      ? "Verification Code Error"
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
                  <p role="alert">{actionData.fieldErrors.verificationCode}</p>
                ) : null}
                <button type="submit">Submit</button>
              </>
            )}
          </Form>

          <div>
            {actionData?.formError ? (
              <p role="alert">{actionData.formError}</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
