import { useLoaderData } from "@remix-run/react"

import { json, redirect, V2_MetaFunction } from "@remix-run/node"

import type { LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/node"

import { StoreContainer } from "../components/store-container"

import {
  getStoreCategories,
  getStoresByCity,
} from "../queries.server/store.query.server"

import { checkCity } from "../utils/validate.server"
import { features } from "../utils/utils.server"

import { routes } from "../routes"

import {
  CLIENT_CACHE_DURATION,
  type AllowedStoresFeatures,
  type StoreWithTags,
} from "../constants"

import storeCardCss from "./../components/styles/store-card.css"
import pageCss from "./styles/stores-all-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeCardCss },
  { rel: "stylesheet", href: pageCss },
]

type LoaderType = {
  name: AllowedStoresFeatures
  title?: string
  stores: StoreWithTags[] | null
}

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Stores ${data.title ?? ""}`,
        title: `SnappFood Clone Stores ${data.title ?? ""}`,
      }
    : { description: "No Store found", title: "No Store" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

export const loader = async ({
  params,
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType | TypedResponse<never>>> => {
  try {
    let city = params.city

    if (!city || city === "") {
      return redirect(routes.addresses)
    }

    city = await checkCity({ cityName: city })

    let stores = await getStoresByCity({ cityName: city })

    if (!stores || stores.length === 0) {
      throw new Response("فروشگاهی وجود ندارد", { status: 404 })
    }

    const feature = params.feature as AllowedStoresFeatures | undefined

    if (!feature || !features.find(feat => feat.name === feature)) {
      throw new Response("این صفحه وجود ندارد", { status: 404 })
    }

    const featureObject = features.find(feat => feat.name === feature)

    if (!featureObject) {
      throw new Response("این صفحه وجود ندارد", { status: 404 })
    }

    let featureStores = await featureObject.getStores({
      stores,
    })

    featureStores = await Promise.all(
      featureStores.map(async store => {
        const tags = await getStoreCategories({ storeId: store.id })
        return { ...store, tags }
      }),
    )

    return json(
      {
        name: featureObject.name,
        title: featureObject.title,
        stores: featureStores,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
        },
      },
    )
  } catch (error) {
    throw error
  }
}

export default function featureStores() {
  const { name, title, stores } = useLoaderData() as unknown as LoaderType

  return (
    <main className="_stores-all-page">
      <h1 className="nonvisual">لیست فرشگاه ها</h1>

      {stores ? (
        <StoreContainer
          title={title ?? ""}
          stores={stores as StoreWithTags[] | null}
        ></StoreContainer>
      ) : (
        <p>فروشگاهی وجود ندارد</p>
      )}
    </main>
  )
}
