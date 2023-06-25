import type { Store } from "@prisma/client"
import {
  LinksFunction,
  LoaderArgs,
  redirect,
  TypedResponse,
} from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"

import { getStoresByCity } from "~/utils/store.query.server"

import storeCardCss from "./../components/styles/store-card.css"
import { StoreContainer } from "~/components/store-container"
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeCardCss },
]

export const loader = async ({
  params,
}: LoaderArgs): Promise<Store[] | null | TypedResponse<never>> => {
  try {
    let stores: Store[] | null = []
    let city = params.city

    if (!city || city == "") {
      return redirect("/addresses")
    }

    const kind = params.kind
    
    stores = await getStoresByCity({
      cityName: city,
      storeKindName: kind ?? undefined,
    })

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
        <StoreContainer
          title="شیراز"
          moreHref="hhh"
          stores={stores as Store[] | null}
        ></StoreContainer>
      </article>
      <Outlet></Outlet>
    </>
  )
}
