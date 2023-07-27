import { useLoaderData } from "@remix-run/react"

import { redirect } from "@remix-run/node"

import type { LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/node"

import type { Store } from "@prisma/client"

import { StoreContainer } from "~/components/store-container"

import { getStoreCategories, getStoresByCity } from "~/queries.server/store.query.server"

import { requireValidatedUser, validateCity } from "~/utils/validate.server"

import { features } from "~/utils/utils.server"

import { AllowedStoresFeatures, StoreWithTags } from "~/constants"

import storeCardCss from "./../components/styles/store-card.css"
import pageCss from "./styles/stores-all.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeCardCss },
  { rel: "stylesheet", href: pageCss },
]

type LoaderType = {
  name: AllowedStoresFeatures
  title?: string
  stores: StoreWithTags[] | null
}

export const loader = async ({
  params,request
}: LoaderArgs): Promise<LoaderType | TypedResponse<never>> => {
  try {
    const user = await requireValidatedUser(request)

    let city = params.city

    if (!city || city === "") {
      return redirect("/addresses")
    }

    city = await validateCity({ cityName: city })

    let stores = await getStoresByCity({ cityName: city })

    if (!stores || stores.length === 0) {
      throw new Response("فروشگاهی وجود ندارد", { status: 404 })
    }

    const featureObject = features.find(feat => feat.name === "kind")

    if (!featureObject) {
      throw new Response("این صفحه وجود ندارد", { status: 404 })
    }

    let kindType = params.featureArgs

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
