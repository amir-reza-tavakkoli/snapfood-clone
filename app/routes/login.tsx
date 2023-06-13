import { useEffect, useState } from "react"

import { useActionData, useSearchParams } from "@remix-run/react"
import { Form } from "@remix-run/react"

import {
  createOrUpdateUser,
  getUserByPhone,
  updateVerificationCode,
} from "~/utils/user.query.server"

import { createUserSession } from "~/utils/session.server"
import {
  badRequest,
  generateVerificationCode,
  generateVerificationExpiry,
  validatePhoneNumber,
  validateUrl,
} from "~/utils/request.server"
import { User } from "@prisma/client"

export const ALLOWED_PHONE_PREFIX = "09"
export const VERIFICATION_CODE_FIGURES = 4
export const VERIFICATION_CODE_EXPIRY_TIME = 5
export const ALLOWED_URLS = [
  "/home",
  "/",
  "/home/stores",
  "/home/orders",
  "/login",
  "/home/addresses",
]

export async function verify() {}

type FieldErrors = {
  phoneNumber?: string | undefined
  verificationCode?: string | undefined
}

export const action = async ({ request }: any) => {
  try {
    const form = await request.formData()

    const state: string | undefined = form.get("state")
    const submittedPhone: string | undefined = form.get("phoneNumber")

    const fieldErrors: FieldErrors = {
      phoneNumber: submittedPhone
        ? validatePhoneNumber(submittedPhone)
        : undefined,
    }

    if (typeof submittedPhone !== "string" || !state) {
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

    const fields = { phoneNumber: submittedPhone }

    let user: User | null
    try {
      user = await getUserByPhone({ phoneNumber: submittedPhone })
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
        user = await createOrUpdateUser({ phoneNumber: submittedPhone })
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
        submittedPhone,
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
  } catch (error) {
    throw error
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
