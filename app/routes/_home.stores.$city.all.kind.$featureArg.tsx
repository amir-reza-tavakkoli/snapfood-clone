import { useLoaderData } from "@remix-run/react"

import { redirect, V2_MetaFunction } from "@remix-run/node"

import type { LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/node"

import { StoreContainer } from "../components/store-container"

import {
  getStoreCategories,
  getStoresByCity,
} from "../queries.server/store.query.server"

import { requireValidatedUser, checkCity } from "../utils/validate.server"

import { features } from "../utils/utils.server"

import { routes } from "../routes"

import { type AllowedStoresFeatures, type StoreWithTags } from "../constants"

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
}: LoaderArgs): Promise<LoaderType | TypedResponse<never>> => {
  try {
    const user = await requireValidatedUser(request)

    let city = params.city

    if (!city || city === "") {
      return redirect(routes.addresses)
    }

    city = await checkCity({ cityName: city })

    let stores = await getStoresByCity({ cityName: city })

    if (!stores) {
      throw new Response("فروشگاهی در شهر انتخاب شده وجود ندارد", {
        status: 404,
      })
    }

    const featureObject = features.find(feat => feat.name === "kind")

    if (!featureObject) {
      throw new Response("این صفحه وجود ندارد", { status: 404 })
    }

    let kindType = params.featureArg

    let featureStores = await featureObject.getStores({
      kind: kindType,
      stores,
    })

    featureStores = await Promise.all(
      featureStores.map(async store => {
        const tags = await getStoreCategories({ storeId: store.id })
        return { ...store, tags }
      }),
    )

    return {
      name: featureObject.name,
      title: featureObject.title,
      stores: featureStores,
    }
  } catch (error) {
    throw error
  }
}

export default function KindStores() {
  const { name, title, stores } = useLoaderData() as unknown as LoaderType

  return (
    <main className="_stores-all-page">
      <h1 className="nonvisual">لیست فرشگاه ها</h1>

      {stores && stores.length > 0 ? (
        <StoreContainer
          title={title ?? ""}
          stores={stores as StoreWithTags[] | null}
        ></StoreContainer>
      ) : (
        <p className="_no-store">فروشگاهی وجود ندارد</p>
      )}
    </main>
  )
}
