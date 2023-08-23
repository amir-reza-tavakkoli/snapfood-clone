import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
  V2_MetaFunction,
} from "@remix-run/react"

import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { User } from "@prisma/client"

import {
  createOrUpdateUser,
  getUserByPhone,
} from "../queries.server/user.query.server"

import { createUserSession, getPhoneNumber } from "../utils/session.server"

import { checkFieldsErrors } from "../utils/utils.server"

import {
  checkPhoneNumber,
  sendVerification,
  validateUrl,
} from "../utils/validate.server"

import { useLogin } from "../hooks/login"

import { GlobalErrorBoundary } from "../components/error-boundary"
import { Button } from "../components/button"
import { Timer } from "../components/timer"
import { Icon } from "../components/icon"

import {
  ALLOWED_URLS,
  INDEX_URL,
  VENDOR_NAME_ENG,
  VERIFICATION_CODE_EXPIRY_MINS,
} from "../constants"

import pageCss from "./styles/login-page.css"
import buttonCss from "./../components/styles/button.css"
import iconCss from "./../components/styles/icon.css"
import errorBoundaryCss from "./../components/styles/error-boundary.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: buttonCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: errorBoundaryCss },
  { rel: "stylesheet", href: pageCss },
]

type FieldErrors = {
  phoneNumber?: string
  verificationCode?: string
}

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: `SnappFood Clone Login`,
    title: `SnappFood Clone Login`,
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type ActionType = {
  codeSent?: boolean
  fieldErrors?: FieldErrors
  formError?: string
  state?: LoginPageState
}

export const action = async ({
  request,
}: ActionArgs): Promise<ActionType | TypedResponse<never>> => {
  try {
    const form = await request.formData()

    let pageState = form.get("state")

    const submittedPhone = form.get("phoneNumber")

    if (
      typeof pageState !== "string" ||
      (pageState !== "verification" && pageState !== "phoneNumber") ||
      !pageState
    ) {
      throw new Response("مشکلی بوجود آمد", { status: 400 })
    }

    if (!submittedPhone || typeof submittedPhone !== "string") {
      return {
        formError: "فرم به درستی کامل نشده است.",
      }
    }

    const fieldErrors: FieldErrors = {
      phoneNumber: submittedPhone
        ? checkPhoneNumber(submittedPhone)
        : undefined,
    }

    if (fieldErrors.phoneNumber) {
      return {
        fieldErrors,
      }
    }

    let user: User | null
    try {
      user = await getUserByPhone({ phoneNumber: submittedPhone })
    } catch {
      return {
        formError: "مشکلی بوجود آمد.",
      }
    }

    if (pageState === "verification") {
      if (!user || !user.verificationCode || !user.verificationCodeExpiry) {
        return {
          formError: "مشکلی بوجود آمد.",
        }
      }

      const submittedCode = form.get("verification")

      if (typeof submittedCode !== "string" || !submittedCode) {
        return {
          formError: "فرم به درستی کامل نشده است.",
        }
      }

      const redirectTo = validateUrl(
        (form.get("redirectTo") as string) || INDEX_URL,
        ALLOWED_URLS,
      )

      if (user.verificationCodeExpiry < new Date(Date.now())) {
        fieldErrors.verificationCode = "مهلت ورود به پایان رسید."
      }

      if (user.verificationCode !== submittedCode) {
        fieldErrors.verificationCode = "رمز وارد شده اشتباه است."
      }

      const check = checkFieldsErrors(fieldErrors, "verification")

      if (check) {
        return check
      }

      try {
        await createOrUpdateUser({
          phoneNumber: submittedPhone,
          isVerified: true,
        })
      } catch (error) {
        return {
          fieldErrors,
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
      fieldErrors.phoneNumber = "کاربر مسدود است."
    }

    const check = checkFieldsErrors(fieldErrors)

    if (check) {
      return check
    }

    try {
      user = await sendVerification({ phoneNumber: submittedPhone })

      return {
        codeSent: true,
      }
    } catch {
      return {
        formError: "مشکلی بوجود آمد.",
      }
    }
  } catch (error) {
    throw error
  }
}

type LoaderType = { isLoggedIn: boolean }

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
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

export type LoginPageState = "phoneNumber" | "verification"

export default function LoginPage() {
  const loaderData = useLoaderData<typeof loader>() as unknown as LoaderType

  const actionData = useActionData() as ActionType

  const [searchParams] = useSearchParams()

  const {
    pgaeState,
    setPageState,
    phoneNumber,
    setPhoneNumber,
    setVerificationCode,
    verificationCode,
    timerFinished,
    setTimerFinished,
  } = useLogin(actionData)

  return (
    <main className="login-wrapper">
      <div className="login-page">
        <h1 className="nonvisual">ورود</h1>

        {loaderData.isLoggedIn ? (
          <p>قبلا وارد شده اید</p>
        ) : (
          <>
            <Form method="post">
              {pgaeState === "phoneNumber" ? (
                <>
                  <div className="_identity">
                    <Icon name={VENDOR_NAME_ENG} color="accent"></Icon>

                    <p>
                      ورود <span>یا </span> عضویت
                    </p>
                  </div>

                  <div className="_input">
                    <label htmlFor="phoneNumber">شماره تلفن‌همراه</label>

                    <input
                      type="text"
                      id="phoneNumber"
                      autoComplete="tel"
                      name="phoneNumber"
                      inputMode="tel"
                      required={true}
                      placeholder={"۰۹*******"}
                      aria-invalid={Boolean(
                        actionData?.fieldErrors?.phoneNumber,
                      )}
                      aria-errormessage={
                        actionData?.fieldErrors?.phoneNumber
                          ? "Phone Number Response"
                          : undefined
                      }
                      onChange={e => {
                        e.preventDefault()
                        if (e.target.value && !isNaN(Number(e.target.value))) {
                          setPhoneNumber(e.target.value)
                        }
                      }}
                    />

                    <small>شماره با ۰۹ شروع می‌شود</small>
                  </div>

                  <input type="hidden" name="state" value="phoneNumber" />

                  <Button
                    type="submit"
                    variant="accent"
                    disabled={
                      phoneNumber.length != 11 || !phoneNumber.match(/\d{11}/)
                    }
                      spining={true}
                      reactTo={[actionData]}
                  >
                    ادامه
                    </Button>

                  {actionData?.fieldErrors?.verificationCode ? (
                    <output
                      role="alert"
                      aria-label="error"
                      aria-live="assertive"
                      className="_error"
                    >
                      {actionData.fieldErrors.phoneNumber}
                    </output>
                  ) : null}
                </>
              ) : (
                <>
                  <div className="_identity">
                    <Icon name="snappfood" color="accent"></Icon>

                    <p>تأیید شماره </p>
                  </div>

                  <button
                    className="_edit"
                    type="button"
                    onClick={() => setPageState("phoneNumber")}
                  >
                    اصلاح شماره
                  </button>

                  <p>
                    کد تأیید به شماره
                    {" " +
                      Number(phoneNumber)
                        .toLocaleString("fa")
                        .replaceAll("٬", "") +
                      " "}
                    فرستاده شد.
                  </p>

                  <label htmlFor="verification">کد تایید</label>

                  {timerFinished ? (
                    <div className="_resend" aria-live="polite">
                      <p>کد تأیید را دریافت نکردید؟</p>

                      <Button
                        type="button"
                        aria-label="Resend"
                        onClick={() => {
                          setPageState("phoneNumber")
                        }}
                      >
                        ارسال دوباره
                      </Button>
                    </div>
                  ) : null}

                  <input
                    type="text"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    id="verification"
                    required={true}
                    name="verification"
                    minLength={4}
                    defaultValue=""
                    placeholder={Number("1234").toLocaleString("fa-IR")}
                    aria-invalid={Boolean(
                      actionData.fieldErrors?.verificationCode,
                    )}
                    aria-errormessage={
                      actionData.fieldErrors?.verificationCode
                        ? "Verification Code Response"
                        : undefined
                    }
                    onChange={e => {
                      e.preventDefault()
                      if (e.target.value && !isNaN(Number(e.target.value))) {
                        setVerificationCode(e.target.value)
                      }
                    }}
                  />

                  <Timer
                    initialSeconds={59}
                    initialMinute={VERIFICATION_CODE_EXPIRY_MINS - 1}
                    setTimerFinished={setTimerFinished}
                  ></Timer>

                  <input
                    type="hidden"
                    name="redirectTo"
                    value={searchParams.get("redirectTo") ?? undefined}
                  />

                  <input type="hidden" name="phoneNumber" value={phoneNumber} />

                  <input type="hidden" name="state" value="verification" />

                  <small>
                    ثبت نام در اسنپ‌فود به منزله
                    <span>پذیرش همه قوانین و شرایط</span>
                    استفاده است.
                  </small>

                  <Button variant="accent" type="submit">
                    عضویت
                  </Button>

                  {actionData?.fieldErrors?.verificationCode ? (
                    <output
                      role="alert"
                      aria-label="error"
                      aria-live="assertive"
                      className="_error"
                    >
                      {actionData.fieldErrors.verificationCode}
                    </output>
                  ) : null}
                </>
              )}
            </Form>

            {actionData && actionData.formError ? (
              <output aria-label="error" aria-live="assertive" role="alert">
                <>
                  <p className="nonvisual">Response</p>

                  <p className="_error">{actionData.formError}</p>
                </>
              </output>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary

export { type ActionType as LoginActionData }
export { type FieldErrors as LoginFieldErrors }
