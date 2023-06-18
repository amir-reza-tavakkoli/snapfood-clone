import {
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { createOrUpdateUser, getUserByPhone } from "~/utils/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { useState, useEffect } from "react"

import { getUserAddresses } from "~/utils/address.query.server"
import { Address } from "@prisma/client"
import { Addresses } from "~/components/addresses"

import addressesCss from "./../components/styles/addresses.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: addressesCss },
]

export const action = async ({ request }: any) => {
  try {
    await requirePhoneNumber(request)

    const form = await request.formData()
    const phoneNumber = form.get("phoneNumber")
    const firstName = form.get("firstName")
    const lastName = form.get("lastName")
    const gender = form.get("gender")
    const birthday = form.get("birthday")
    const email = form.get("email")(gender)

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

export const loader = async ({
  request,
}: LoaderArgs): Promise<Address[] | null> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("User Is Not Verified Or Suspended")
    }

    const addresses = await getUserAddresses({ phoneNumber })
    return addresses
  } catch (error) {
    throw error
  }
}

export default function UserInfo() {
  const [HomeAddressState, setHomeAddressState] = useOutletContext<any>()

  const addresses = useLoaderData<typeof loader>() as Address[] | null

  return (
    <>
      <Addresses addresses={addresses}></Addresses>
      <Outlet></Outlet>
    </>
  )
}
