import { Outlet, useLoaderData } from "@remix-run/react"

import { redirect } from "@remix-run/node"

import type { LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/node"

import type { Store } from "@prisma/client"

import {
  getStoreCategories,
  getStoresByCity,
  getStoresWithDiscount,
  getStoresWithFreeShipment,
} from "~/queries.server/store.query.server"

import { AllowedStoresFeatures, StoreWithTags } from "~/constants"

import { validateCity } from "~/utils/validate.server"

import { GlobalErrorBoundary } from "~/components/error-boundary"

import storeCardCss from "./../components/styles/store-card.css"
import { StoreContainer } from "~/components/store-container"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeCardCss },
]

type LoaderType = {
  stores: Store[] | null
  cityName: string
  withDiscount?: StoreWithTags[]
  withFreeShipment?: StoreWithTags[]
}

const takeThisMuch = 4

export const loader = async ({
  params,
}: LoaderArgs): Promise<LoaderType | TypedResponse<never>> => {
  try {
    let city = params.city

    if (!city || city == "") {
      return redirect("/addresses")
    }

    await validateCity({ cityName: city })

    let stores = await getStoresByCity({
      cityName: city,
    })

    let withDiscount = await getStoresWithDiscount({
      stores,
      takes: takeThisMuch,
    })

    let withFreeShipment = await getStoresWithFreeShipment({
      stores,
      takes: takeThisMuch,
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
              moreHref={`/stores/all/${cityName}/${features.all}`}
              stores={stores}
            ></StoreContainer>

            {withDiscount ? (
              <StoreContainer
                title="تخفیف دار"
                stores={withDiscount}
                moreHref={`/stores/all/${cityName}/${features.withDiscount}`}
              ></StoreContainer>
            ) : null}

            {withFreeShipment ? (
              <StoreContainer
                title="ارسال رایگان"
                stores={withFreeShipment}
                moreHref={`/stores/all/${cityName}/${features.withFreeShipment}`}
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
