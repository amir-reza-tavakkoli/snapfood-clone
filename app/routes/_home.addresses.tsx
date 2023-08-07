import {
  useLoaderData,
  useOutletContext,
  V2_MetaFunction,
} from "@remix-run/react"

import { json, LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/server-runtime"

import type { Address } from "@prisma/client"

import { getUserAddresses } from "../queries.server/address.query.server"

import { requireValidatedUser } from "../utils/validate.server"

import { Addresses } from "../components/addresses"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { CLIENT_CACHE_DURATION } from "~/constants"

import pageCss from "./../components/styles/addresses.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: "SnappFood Clone Addresses",
    title: "SnappFood Clone Addresses",
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = Address[] | null

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    const addresses = await getUserAddresses({ phoneNumber: user.phoneNumber })

    return json(addresses, {
      headers: {
        "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
      },
    })
  } catch (error) {
    throw error
  }
}

export default function AddressesPage() {
  const [HomeAddressState, setHomeAddressState] = useOutletContext<any>()

  const addresses = useLoaderData<typeof loader>() as unknown as LoaderType

  return (
    <main>
      <h1 className="nonvisual">آدرس ها</h1>

      <Addresses
        addresses={addresses}
        setHomeAddress={setHomeAddressState}
        homeAddress={HomeAddressState}
      ></Addresses>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
