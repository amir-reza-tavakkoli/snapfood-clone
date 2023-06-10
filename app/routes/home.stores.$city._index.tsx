import { Address, Store } from "@prisma/client"
import type { LoaderArgs } from "@remix-run/node"
import { Link, Outlet, useActionData, useLoaderData } from "@remix-run/react"
import { useEffect } from "react"

import { getStores, getStoresByCity } from "~/utils/store.query.server"

const DEFAULT_CITY = "تهران"

export const action = async ({ request, params }: any) => {
  try {
    const stores = await getStores()

    return { stores }
  } catch (error) {
    throw error
  }
}

export const loader = async ({
  params,
  request,
}: LoaderArgs): Promise<Store[] | null> => {
  try {
    let stores: Store[] | null = []

    let city = params.city
    // if (city) {
    //   city = DEFAULT_CITY
    // }

    if (city) {
      stores = await getStoresByCity({ cityName: city })
    }

    if (!stores || stores.length == 0) {
      stores = await getStores()
    }
    return stores
  } catch (error) {
    throw error
  }
}

export default function Index() {
  const stores = useLoaderData<typeof loader>()

  return (
    <>
      <div>
        {stores &&
          stores.map((store, index) => (
            <div key={index}>
              <p>{store.name}</p>
              <Link to={`../store/${store.id}`}>go to</Link>
            </div>
          ))}
      </div>
      <Outlet></Outlet>
    </>
  )
}
