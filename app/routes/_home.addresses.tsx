import { useLoaderData, useOutletContext } from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import type { Address } from "@prisma/client"

import { getUserAddresses } from "~/queries.server/address.query.server"

import { requireValidatedUser } from "~/utils/validate.server"

import { Addresses } from "~/components/addresses"
import { GlobalErrorBoundary } from "~/components/error-boundary"

import addressesCss from "./../components/styles/addresses.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: addressesCss },
]

type LoaderType = Address[] | null

export const loader = async ({
  request,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const addresses = await getUserAddresses({ phoneNumber: user.phoneNumber })

    return addresses
  } catch (error) {
    throw error
  }
}

export default function AddressesPage() {
  const [HomeAddressState, setHomeAddressState] = useOutletContext<any>() // for side effetcs

  const addresses = useLoaderData<typeof loader>() as LoaderType

  return (
    <main>
      <h1 className="nonvisual">آدرس ها</h1>

      <Addresses addresses={addresses}></Addresses>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
