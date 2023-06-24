import { useState } from "react"

import {
  Link,
  useActionData,
  useLoaderData,
  useRouteError,
  Form,
} from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { requirePhoneNumber } from "~/utils/session.server"

import { createOrUpdateUser, getUserByPhone } from "~/utils/user.query.server"

import type { User } from "@prisma/client"

import { Button } from "~/components/button"

import { DEAFULT_DIRECTION } from "~/constants"

import userPageCss from "./styles/user-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: userPageCss },
]

export const action = async ({ request }: any) => {
  try {
    const form = await request.formData()

    const phoneNumber = form.get("phoneNumber")
    const firstName = form.get("firstName")
    const lastName = form.get("lastName")
    const gender = !!form.get("gender")
    const birthday = form.get("birthday")
    const email = form.get("email")

    if (!phoneNumber) {
      throw new Error("شماره تلفن اشتباه است")
    }

    const oldUser = await getUserByPhone({ phoneNumber })

    if (!oldUser) {
      throw new Error("کاربر وجود ندارد")
    }

    const user = await createOrUpdateUser({
      phoneNumber,
      firstName,
      lastName,
      gender,
      birthday,
      email,
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
  const phoneNumber = await requirePhoneNumber(request)

  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    return user
  } catch (error) {
    throw error
  }
}

export default function UserInfo() {
  const user = useLoaderData<typeof loader>()
  const actionData = useActionData()

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [gender, setGender] = useState(user.gender)
  const [birthday, setBirthday] = useState(user.birthday)
  const [email, setEmail] = useState(user.email)

  return (
    <main className="_user-page" dir={DEAFULT_DIRECTION}>
      <Form method="post">
        <p>ویرایش حساب کاربری</p>
        <div>
          <label htmlFor="phoneNumber">شماره موبایل</label>

          <input
            readOnly
            type="text"
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
              e.preventDefault()

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
              e.preventDefault()

              if (e.target.value) {
                setLastName(e.target.value)
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="gender">جنسیت</label>

          <select
            autoComplete="sex"
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
              e.preventDefault()

              if (e.target.value) {
                setEmail(e.target.value)
              }
            }}
          />
        </div>

        <div>
          <label htmlFor="birthdate">تاریخ تولد</label>

          <input
            autoComplete="bday"
            type="date"
            name="birthdate"
            id="birthdate"
            value={String(birthday ?? new Date(Date.now()))}
            onChange={e => {
              e.preventDefault()

              if (e.target.value) {
                setBirthday(e.target.value)
              }
            }}
          />
        </div>

        <Button type="submit" variant="accent">
          ثبت
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

export function ErrorBoundary() {
  const error = useRouteError()

  const errorMessage = error instanceof Error ? error.message : undefined
  console.log(error);
  
  return (
    <div aria-label="error" role="alert" aria-live="assertive" className="boundary-error">
      <h1>مشکلی پیش آمد!</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}

      <Link to="/user-info">دوباره امتحان کنید</Link>

    </div>
  )
}
