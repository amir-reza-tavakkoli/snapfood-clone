import {
  Form,
  useActionData,
  useLoaderData,
  useSearchParams,
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
} from "~/queries.server/user.query.server"

import { createUserSession, getPhoneNumber } from "~/utils/session.server"
import { checkFieldsErrors } from "~/utils/utils.server"

import {

  sendVerification,
  validateUrl,
} from "~/utils/validate.server"

import { useLogin } from "~/hooks/login"

import {
  ALLOWED_PHONE_PREFIX,
  ALLOWED_URLS,
  INDEX_URL,
  VENDOR_NAME_ENG,
  VERIFICATION_CODE_EXPIRY_MINS,
} from "~/constants"

import { GlobalErrorBoundary } from "~/components/error-boundary"
import { Button } from "~/components/button"
import { Timer } from "~/components/timer"

import pageCss from "./styles/login-page.css"
import { Icon } from "~/components/icon"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]
export function checkPhoneNumber(phoneNumber: string) {
  if (
    phoneNumber.length != 11 ||
    !phoneNumber.match(/\d{11}/) ||
    !Boolean(parseInt(phoneNumber)) ||
    !phoneNumber.startsWith(ALLOWED_PHONE_PREFIX)
  ) {
    return "شماره تلفن اشتباه است"
  }
}
type FieldErrors = {
  phoneNumber?: string
  verificationCode?: string
}

type ActionDataFileds = {
  codeSent?: boolean
  fieldErrors?: FieldErrors
  formError?: string
  state?: LoginPageState
}

export const action = async ({
  request,
}: ActionArgs): Promise<ActionDataFileds | TypedResponse<never>> => {
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

      checkFieldsErrors(fieldErrors, "verification")

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

    checkFieldsErrors(fieldErrors)

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

export type LoginPageState = "phoneNumber" | "verification"

export default function LoginPage() {
  const loaderData = useLoaderData<typeof loader>()

  const actionData = useActionData() as ActionDataFileds

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
    <main className="login-page">
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
                    ورود <span>یا </span> عضویت{" "}
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
                    placeholder={
                      Number("09").toLocaleString("fa-IR") + "*******"
                    }
                    aria-invalid={Boolean(actionData?.fieldErrors?.phoneNumber)}
                    aria-errormessage={
                      actionData?.fieldErrors?.phoneNumber
                        ? "Phone Number Error"
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
                >
                  ادامه
                </Button>

                {actionData?.fieldErrors?.verificationCode ? (
                  <output role="alert" aria-label="error" aria-live="assertive">
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
                  defaultValue=""
                  placeholder={Number("1234").toLocaleString("fa-IR")}
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
                    if (e.target.value && !isNaN(Number(e.target.value))) {
                      setVerificationCode(e.target.value)
                    }
                  }}
                />

                <Timer
                  initialSeconds={0}
                  initialMinute={VERIFICATION_CODE_EXPIRY_MINS}
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
                  ثبت نام در اسنپ‌فود به منزله{" "}
                  <span>پذیرش همه قوانین و شرایط</span>
                  استفاده است.
                </small>

                <Button variant="accent" type="submit">
                  عضویت
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

export { type ActionDataFileds as LoginActionData }
export { type FieldErrors as LoginFieldErrors }
