import type { Store } from "@prisma/client"
import type { LoaderArgs } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"

import { getStores, getStoresByCity } from "~/utils/store.query.server"

export const loader = async ({
  params,
}: LoaderArgs): Promise<Store[] | null> => {
  try {
    let stores: Store[] | null = []
    let city = params.city

    if (!city) {
      throw new Error("Unsupported City")
    }

    stores = await getStoresByCity({ cityName: city })

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
