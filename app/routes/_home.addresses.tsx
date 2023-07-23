import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useRouteError,
} from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import type { Address } from "@prisma/client"

import { getUserByPhone } from "~/queries.server/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { getUserAddresses } from "~/queries.server/address.query.server"

import { Addresses } from "~/components/addresses"

import addressesCss from "./../components/styles/addresses.css"
import { requireValidatedUser, validateUser } from "~/utils/validate.server"
import { GlobalErrorBoundary } from "~/components/error-boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: addressesCss },
]

export const loader = async ({
  request,
}: LoaderArgs): Promise<Address[] | null> => {
  try {
    const user = await requireValidatedUser(request)

    const addresses = await getUserAddresses({ phoneNumber : user.phoneNumber })

    return addresses
  } catch (error) {
    throw error
  }
}

export default function AddressesPage() {
  const [HomeAddressState, setHomeAddressState] = useOutletContext<any>()

  const addresses = useLoaderData<typeof loader>() as Address[] | null

  return (
    <>
      <Addresses addresses={addresses}></Addresses>
      <Outlet></Outlet>
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
