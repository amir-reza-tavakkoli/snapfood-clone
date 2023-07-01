import { useEffect, useState } from "react"

import { useActionData, useLoaderData, useSearchParams } from "@remix-run/react"

import { Form } from "@remix-run/react"

import {
  createOrUpdateUser,
  getUserByPhone,
  updateVerificationCode,
} from "~/queries.server/user.query.server"

import type {
  ActionArgs,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import { createUserSession, getPhoneNumber } from "~/utils/session.server"
import {
  badRequest,
  generateVerificationCode,
  generateVerificationExpiry,
} from "~/utils/utils.server"

import { checkPhoneNumber, validateUrl } from "~/utils/validate.server"

import type { User } from "@prisma/client"

import {
  ALLOWED_URLS,
  INDEX_URL,
  VERIFICATION_CODE_EXPIRY_TIME,
  VERIFICATION_CODE_FIGURES,
} from "~/constants"

import { GlobalErrorBoundary } from "~/components/error-boundary"
import { Button } from "~/components/button"

type FieldErrors = {
  phoneNumber?: string
  verificationCode?: string
}

export const action = async ({
  request,
}: ActionArgs): Promise<
  | {
      codeSent?: boolean
      fieldErrors?: FieldErrors
      fields?: string
      formError?: string
      state?: LoginPageState
    }
  | TypedResponse<never>
> => {
  try {
    const form = await request.formData()

    let state = form.get("state")

    const submittedPhone = form.get("phoneNumber")

    if (typeof submittedPhone !== "string") {
      throw new Response("شماره تلفن را صحیح وارد کنید", { status: 400 })
    }

    if (
      typeof state !== "string" ||
      (state !== "verification" && state !== "phoneNumber")
    ) {
      throw new Response("مشکلی بوجود آمد", { status: 400 })
    }

    const fieldErrors: FieldErrors = {
      phoneNumber: submittedPhone
        ? checkPhoneNumber(submittedPhone)
        : undefined,
    }

    if (typeof submittedPhone !== "string" || !state) {
      return {
        fieldErrors: undefined,
        fields: undefined,
        formError: "Form Not Submitted Correctly.",
      }
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
        formError: "مشکلی بوجود آمد.",
      }
    }

    if (state === "verification") {
      if (!user) {
        return {
          formError: "مشکلی بوجود آمد.",
        }
      }

      const submittedCode = form.get("verification")

      if (typeof submittedCode !== "string" || !submittedCode) {
        return {
          fieldErrors: undefined,
          fields: undefined,
          formError: "فرم به درستی کامل نشده است.",
        }
      }

      const redirectTo = validateUrl(
        (form.get("redirectTo") as string) || INDEX_URL,
        ALLOWED_URLS,
      )

      if (
        user.verificationCode! !== submittedCode ||
        user.verificationCodeExpiry! < new Date(Date.now())
      ) {
        fieldErrors.verificationCode = "رمز یک بار مصرف اشتباه است."
      }

      if (Object.values(fieldErrors).some(Boolean)) {
        return {
          fieldErrors,

          formError: undefined,
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
          formError: "مشکلی بوجود آمد.",
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
        formError: "مشکلی بوجود آمد.",
      }
    }

    return {
      codeSent: true,
    }
  } catch (error) {
    throw error
  }
}

export const loader = async ({
  request,
}: LoaderArgs): Promise<{ isLoggedIn: boolean }> => {
  try {
    const phoneNumber = await getPhoneNumber(request)

    if (!phoneNumber) {
      return { isLoggedIn: false }
    }

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      return { isLoggedIn: false }
    }

    return { isLoggedIn: true }
  } catch (error) {
    throw error
  }
}

const phoneCookieName = "phoneNumber"

type LoginPageState = "phoneNumber" | "verification"

export default function LoginPage() {
  const loaderData = useLoaderData<typeof loader>()

  const actionData = useActionData() as {
    codeSent?: boolean
    fieldErrors?: FieldErrors
    fields?: string
    formError?: string
    state?: LoginPageState
  }

  const [searchParams] = useSearchParams()

  const [phoneNumber, setPhoneNumber] = useState<string>("")

  const [verificationCode, setVerificationCode] = useState<String>("")

  const [pgaeState, setPageState] = useState<LoginPageState>("phoneNumber")

  useEffect(() => {
    if (pgaeState === "phoneNumber" && actionData && actionData.codeSent) {
      setPageState("verification")
    }
  }, [actionData?.codeSent])

  useEffect(() => {
    if (pgaeState === "verification") {
      setPhoneNumber(sessionStorage.getItem(phoneCookieName)!)
    }
  }, [verificationCode])

  useEffect(() => {
    if (pgaeState === "phoneNumber" && phoneNumber && phoneNumber !== "") {
      sessionStorage.setItem(phoneCookieName, phoneNumber)
    }
  }, [phoneNumber])

  return (
    <main>
      <h1>ورود</h1>

      {loaderData.isLoggedIn ? (
        <p>قبلا وارد شده اید</p>
      ) : (
        <>
          <Form method="post">
            {pgaeState === "phoneNumber" ? (
              <>
                <label htmlFor="phoneNumber">شماره تماس</label>

                <input
                  type="text"
                  id="phoneNumber"
                  autoComplete="tel"
                  name="phoneNumber"
                  inputMode="tel"
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

                <input type="hidden" name="state" value="phoneNumber" />

                <Button type="submit" variant="accent">
                  دریافت کد تایید ورود
                </Button>

                {actionData?.fieldErrors?.verificationCode ? (
                  <output role="alert" aria-label="error" aria-live="assertive">
                    {actionData.fieldErrors.phoneNumber}
                  </output>
                ) : null}
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => setPageState("phoneNumber")}
                >
                  بازگشت
                </Button>

                <label htmlFor="verification">کد تایید</label>

                <input
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  id="verification"
                  name="verification"
                  placeholder="1234"
                  aria-invalid={Boolean(
                    actionData.fieldErrors?.verificationCode,
                  )}
                  aria-errormessage={
                    actionData.fieldErrors?.verificationCode
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

                <input
                  type="hidden"
                  name="redirectTo"
                  value={searchParams.get("redirectTo") ?? undefined}
                />

                <input type="hidden" name="phoneNumber" value={phoneNumber} />

                <input type="hidden" name="state" value="verification" />

                <Button variant="accent" type="submit">
                  Submit
                </Button>

                {actionData?.fieldErrors?.verificationCode ? (
                  <output role="alert" aria-label="error" aria-live="assertive">
                    {actionData.fieldErrors.verificationCode}
                  </output>
                ) : null}
              </>
            )}
          </Form>

          {actionData && actionData.formError ? (
            <output aria-label="error" aria-live="assertive" role="alert">
              <>
                <p className="nonvisual">Error</p>

                <p>{actionData.formError}</p>
              </>
            </output>
          ) : null}
        </>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
