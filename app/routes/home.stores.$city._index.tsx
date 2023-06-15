import type { Store } from "@prisma/client"
import type { LinksFunction, LoaderArgs } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"

import { getStoreCategories, getStores, getStoresByCity } from "~/utils/store.query.server"
import { VendorCard } from "~/components/store-card"

import storeCardCss from "./../components/store-card.css"
import { StoreContainer } from "~/components/store-container"
export const links: LinksFunction = () => [{ rel: "stylesheet", href: storeCardCss }]

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
      <article className="_storesCity_container">
<StoreContainer title="شیراز" moreHref="hhh" stores={stores as (Store[] | null)}></StoreContainer>
      </article>
      <Outlet></Outlet>
    </>
  )
}
