import { useActionData, useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { Form } from "@remix-run/react"

import { createOrUpdateUser, getUserByPhone } from "~/utils/query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { useState } from "react"

export const action = async ({ request }: any) => {
  try {
    await requirePhoneNumber(request)

    const form = await request.formData()
    const phoneNumber = form.get("phoneNumber")
    const firstName = form.get("firstName")
    const lastName = form.get("lastName")
    const gender = form.get("gender")
    const birthday = form.get("birthday")
    const email = form.get("email")
    console.log(gender)

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

export const loader = async ({ request }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    return { user }
  } catch (error) {
    throw error
  }
}

export default function UserInfo() {
  const loaderData = useLoaderData<typeof loader>()
  const actionData = useActionData()

  const [firstName, setFirstName] = useState(loaderData.user.firstName)
  const [lastName, setLastName] = useState(loaderData.user.lastName)
  const [gender, setGender] = useState(loaderData.user.gender)
  const [birthday, setBirthday] = useState(loaderData.user.birthday)
  const [email, setEmail] = useState(loaderData.user.email)

  return (
    <Form method="post">
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={loaderData.user.phoneNumber}
      />
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName ?? ""}
        onChange={e => {
          e.preventDefault()
          if (e.target.value) {
            setFirstName(e.target.value)
          }
        }}
      />

      <label htmlFor="lastName"> Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName ?? ""}
        onChange={e => {
          e.preventDefault()
          if (e.target.value) {
            setLastName(e.target.value)
          }
        }}
      />
      <label htmlFor="gender">Gender</label>
      <input
        type="text"
        name="gender"
        id="gender"
        value={gender ?? ""}
        onChange={e => {
          e.preventDefault()
          if (e.target.value) {
            setGender(e.target.value)
          }
        }}
      />
      <label htmlFor="email">Email</label>
      <input
        type="text"
        name="email"
        id="email"
        value={email ?? ""}
        onChange={e => {
          e.preventDefault()
          if (e.target.value) {
            setEmail(e.target.value)
          }
        }}
      />
      <label htmlFor="birthdate">birthdate</label>
      <input
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

      <button type="submit">Submit</button>
      {actionData?.successful ? <p>Updated</p> : null}
      {actionData?.unsuccessful ? <p>Could Not Update</p> : null}
    </Form>
  )
}
