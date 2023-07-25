import { useState } from "react"

import { useActionData, useLoaderData, Form } from "@remix-run/react"

import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/server-runtime"

import {
  createOrUpdateUser,
  getUserByEmail,
  getUserByPhone,
} from "~/queries.server/user.query.server"

import type { User } from "@prisma/client"

import { Button } from "~/components/button"
import { GlobalErrorBoundary } from "~/components/error-boundary"

import { DEAFULT_DIRECTION } from "~/constants"

import {
  checkPhoneNumber,
  requireValidatedUser,
  validateUser,
} from "~/utils/validate.server"

import pageCss from "./styles/user-page.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]

export const action = async ({
  request,
}: ActionArgs): Promise<{ successful?: boolean; unsuccessful?: boolean }> => {
  try {
    const form = await request.formData()

    const phoneNumber = form.get("phoneNumber")
    const firstName = form.get("firstName")
    const lastName = form.get("lastName")
    const gender = form.get("gender")
    const birthday = form.get("birthday")
    const email = form.get("email")
    console.log(birthday)

    if (
      !phoneNumber ||
      typeof phoneNumber !== "string" ||
      checkPhoneNumber(phoneNumber)
    ) {
      throw new Error("شماره تلفن اشتباه است")
    }

    if (
      (firstName && typeof firstName !== "string") ||
      (lastName && typeof lastName !== "string") ||
      (birthday && typeof birthday !== "string") ||
      (email && typeof email !== "string") ||
      (gender && typeof gender !== "string")
    ) {
      throw new Response("فرمت ورودی اشتباه است.", { status: 400 })
    }

    const oldUser = await getUserByPhone({ phoneNumber })

    validateUser({ user: oldUser })

    if (email) {
      const userByEmail = await getUserByEmail({ email })

      if (userByEmail && userByEmail.phoneNumber !== phoneNumber) {
        throw new Response("این ایمیل قبلا ثبت شده است.", { status: 400 })
      }
    }

    const user = await createOrUpdateUser({
      phoneNumber,
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      gender: Boolean(Number(gender)) ?? undefined,
      birthday: birthday ?  new Date(birthday) :  undefined,
      email: email ?? undefined,
    })

    if (user) return { successful: true }

    return { unsuccessful: true }
  } catch (error) {
    return {
      unsuccessful: true,
    }
  }
}

export const loader = async ({ request }: LoaderArgs): Promise<User> => {
  try {
    const user = await requireValidatedUser(request)

    return user
  } catch (error) {
    throw error
  }
}

export default function UserInfoPage() {
  const user = useLoaderData<typeof loader>()

  const actionData = useActionData()

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [gender, setGender] = useState(user.gender)
  const [birthday, setBirthday] = useState(user.birthday?.split("T")[0])
  const [email, setEmail] = useState(user.email)

  return (
    <main className="_user-page" dir={DEAFULT_DIRECTION}>
      <h1>ویرایش حساب کاربری</h1>

      <Form method="post">
        <div>
          <label htmlFor="phoneNumber">شماره موبایل</label>

          <input
            readOnly
            type="text"
            id="phoneNumber"
            value={Number(user.phoneNumber)
              .toLocaleString("fa")
              .replace(/٬/g, "")}
          />

          <input
            readOnly
            type="hidden"
            name="phoneNumber"
            id="phoneNumber"
            value={user.phoneNumber}
          />
        </div>

        <div>
          <label htmlFor="firstName">نام</label>

          <input
            placeholder="اسم"
            autoComplete="given-name"
            type="text"
            name="firstName"
            id="firstName"
            value={firstName ?? undefined}
            onChange={e => {
              if (e.target.value) {
                setFirstName(e.target.value)
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="lastName"> نام خانوادگی</label>

          <input
            placeholder="..."
            autoComplete="family-name"
            type="text"
            name="lastName"
            id="lastName"
            value={lastName ?? undefined}
            onChange={e => {
              if (e.target.value) {
                setLastName(e.target.value)
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="gender">جنسیت</label>

          <select
            autoComplete="sex gender"
            name="gender"
            id="gender"
            onChange={e => {
              e.preventDefault()
              if (e.target.value) {
                setGender(!!e.target.value)
              }
            }}
          >
            <option aria-label="Male" value={0} selected={!gender}>
              آقا
            </option>
            <option aria-label="Female" value={1} selected={gender}>
              خانوم
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="email">ایمیل</label>

          <input
            placeholder="abc@mail.com"
            type="email"
            autoComplete="email"
            inputMode="email"
            name="email"
            id="email"
            value={email ?? undefined}
            onChange={e => {
              if (e.target.value) {
                setEmail(e.target.value)
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="birthday">تاریخ تولد</label>

          <input
            autoComplete="bday"
            type="date"
            name="birthday"
            id="birthday"
            value={birthday ?? undefined}
            onChange={e => {
              if (e.target.value) {
                setBirthday(e.target.value)
              }
            }}
          />
        </div>

        <Button type="submit" variant="accent" className="_register">
          ثبت تغییرات
        </Button>

        <output role="alert" aria-aria-live="assertive">
          {actionData?.successful ? (
            <p className="_success">تغییرات ثبت شد</p>
          ) : null}

          {actionData?.unsuccessful ? (
            <p aria-label="error" className="_error">
              مشکلی پیش آمد
            </p>
          ) : null}
        </output>
      </Form>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
