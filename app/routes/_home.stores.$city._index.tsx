import { Outlet, useLoaderData } from "@remix-run/react"

import { redirect, V2_MetaFunction } from "@remix-run/node"

import type { LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/node"

import type { Store } from "@prisma/client"

import {
  getStoreCategories,
  getStoresByCity,
  getStoresWithDiscount,
  getStoresWithFreeShipment,
} from "../queries.server/store.query.server"

import { checkCity } from "../utils/validate.server"

import { GlobalErrorBoundary } from "../components/error-boundary"
import { StoreContainer } from "../components/store-container"

import { routes } from "../routes"

import { type AllowedStoresFeatures, type StoreWithTags } from "../constants"

import storeCardCss from "./../components/styles/store-card.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeCardCss },
]

type LoaderType = {
  stores: Store[] | null
  cityName: string
  withDiscount?: StoreWithTags[]
  withFreeShipment?: StoreWithTags[]
}

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Stores ${data.cityName ?? ""}`,
        title: `SnappFood Clone Stores ${data.cityName ?? ""}`,
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
}: LoaderArgs): Promise<LoaderType | TypedResponse<never>> => {
  try {
    let city = params.city

    if (!city || city === "") {
      return redirect(routes.addresses)
    }

    await checkCity({ cityName: city })

    let stores = await getStoresByCity({
      cityName: city,
    })

    const takeThisMuch = 4

    let withDiscount = await getStoresWithDiscount({
      stores,
      take: takeThisMuch,
    })

    let withFreeShipment = await getStoresWithFreeShipment({
      stores,
      take: takeThisMuch,
    })

    if (stores)
      stores = await Promise.all(
        stores.map(async store => {
          const tags = await getStoreCategories({ storeId: store.id })
          return { ...store, tags }
        }),
      )

    if (withDiscount)
      withDiscount = await Promise.all(
        withDiscount.map(async store => {
          const tags = await getStoreCategories({ storeId: store.id })
          return { ...store, tags }
        }),
      )

    if (withFreeShipment)
      withFreeShipment = await Promise.all(
        withFreeShipment.map(async store => {
          const tags = await getStoreCategories({ storeId: store.id })
          return { ...store, tags }
        }),
      )

    return {
      stores,
      cityName: city,
      withDiscount,
      withFreeShipment,
    }
  } catch (error) {
    throw error
  }
}

export default function CityStores() {
  const { stores, cityName, withDiscount, withFreeShipment } =
    useLoaderData() as unknown as LoaderType

  const features: {
    all?: AllowedStoresFeatures
    withDiscount?: AllowedStoresFeatures
    withFreeShipment?: AllowedStoresFeatures
  } = {
    all: stores ? "all" : undefined,
    withDiscount: withDiscount ? "discount" : undefined,
    withFreeShipment: withFreeShipment ? "freeShipment" : undefined,
  }

  return (
    <>
      <main className="_stores-city-page">
        <h1 className="nonvisual">فروشگاه ها</h1>

        {stores && cityName ? (
          <>
            <StoreContainer
              title={`همه در ${cityName}`}
              moreHref={routes.storesFeature(cityName, features.all!)}
              stores={stores}
            ></StoreContainer>

            {withDiscount ? (
              <StoreContainer
                title="تخفیف دار"
                stores={withDiscount}
                moreHref={routes.storesFeature(
                  cityName,
                  features.withDiscount!,
                )}
              ></StoreContainer>
            ) : null}

            {withFreeShipment ? (
              <StoreContainer
                title="ارسال رایگان"
                stores={withFreeShipment}
                moreHref={routes.storesFeature(
                  cityName,
                  features.withFreeShipment!,
                )}
              ></StoreContainer>
            ) : null}
          </>
        ) : (
          <p>فروشگاهی وجود ندارد</p>
        )}
      </main>

      <Outlet></Outlet>
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
