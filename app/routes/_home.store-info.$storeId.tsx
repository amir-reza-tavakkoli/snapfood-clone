import { useState } from "react"

import { Link, useLoaderData, V2_MetaFunction } from "@remix-run/react"

import {
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Address, Store, storeSchedule } from "@prisma/client"

import type { Map } from "leaflet"

import {
  getStore,
  getStoreCategories,
  getStoreSchedule,
} from "../queries.server/store.query.server"
import { getAddressById } from "../queries.server/address.query.server"
import { getStoreComments } from "../queries.server/comment.query"

import { getFullAddress, getStoreCurrentSchedule } from "../utils/utils"

import { requireUser, validateNumberParam } from "../utils/validate.server"

import { Icon } from "../components/icon"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { ClientOnly } from "../client.map"
import { MapComponent } from "../components/map.client"
import { CommentComp } from "../components/comment"

import { routes } from "../routes"

import {
  CLIENT_CACHE_DURATION,
  DEFAULT_COORDINATIONS,
  DEFAULT_CURRENCY,
  DEFAULT_IMG_PLACEHOLDER,
  StoreComment,
} from "../constants"

import commentCss from "./../components/styles/comment.css"
import pageCss from "./styles/store-info-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageCss },
  { rel: "stylesheet", href: commentCss },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
]

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Store Info ${data.store.name ?? ""}`,
        title: `SnappFood Clone Store Info ${data.store.name ?? ""}`,
      }
    : { description: "No Store found", title: "No Store" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = {
  schedules: storeSchedule[]
  store: Store
  categories: string[]
  address: Address
  comments: StoreComment[]
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireUser(request)

    const storeId = validateNumberParam(Number(params.storeId))

    const store = await getStore({ storeId })

    if (!store) {
      throw new Response("فروشگاه نامعتبر است")
    }

    const schedules = await getStoreSchedule({ store })

    const categories = await getStoreCategories({ storeId })

    const address = await getAddressById({ addressId: store.addressId })

    if (!address) {
      throw new Response("آدرس نامعتبر است")
    }

    const comments = await getStoreComments({ storeId, isVisible: true })

    return json(
      { schedules, store, categories, address, comments },
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

export default function StoreInfoPage() {
  const { schedules, store, categories, address, comments } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  const now = new Date(Date.now())

  const [map, setMap] = useState<Map | null>(null)

  const schedule = getStoreCurrentSchedule(schedules)

  return (
    <main className="store-info">
      <Link to={routes.store(store.id)}>
        <address aria-label="Info">
          <img
            width={40}
            height={40}
            src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
            alt=""
            role="presentation"
            loading="lazy"
          />

          <div>
            <h1>{store.name}</h1>

            <small>{categories.join(", ")}</small>

            <p>
              <Icon name="navigation" color="faded"></Icon>
              {getFullAddress(address)}
            </p>
          </div>

          <div className="_map-container">
            <ClientOnly
              fallback={<div style={{ height: 100, background: "#d1d1d1" }} />}
            >
              {() => (
                <MapComponent
                  map={map}
                  setMap={setMap}
                  height={"200px"}
                  initPosition={[
                    address.xAxis ?? DEFAULT_COORDINATIONS.xAxis,
                    address.yAxis ?? DEFAULT_COORDINATIONS.yAxis,
                  ]}
                />
              )}
            </ClientOnly>
          </div>
        </address>
      </Link>

      <dl>
        <span>
          <dt>ساعات کاری</dt>

          <Icon name="user"></Icon>

          <dd>
            {schedule ? (
              <span className="_store-state">
                <span className="_store-open">باز</span>
                امروز از ساعت
                <span> {schedule.startTime.toLocaleString("fa")} </span>
                تا
                <span> {schedule.endTime.toLocaleString("fa")} </span>
              </span>
            ) : (
              <span className="_store-closed">بسته</span>
            )}
          </dd>
        </span>

        <span>
          <dt>شیوه های پرداخت</dt>

          <Icon name="pay"></Icon>

          <dd>
            {store.takesOfflineOrder ? "  آفلاین" + ", " : null}
            آنلاین
          </dd>
        </span>

        <span>
          <dt>حداقل سبد خرید</dt>

          <Icon name="cart"></Icon>

          <dd>
            {store.minOrderPrice.toLocaleString("fa") + " " + DEFAULT_CURRENCY}
          </dd>
        </span>
      </dl>

      {store.score && store.score > 0 ? (
        <div>
          <p className="nonvisual">امتیازات فروشگاه</p>
          <span>
            <span className="_store-score">
              {store.score.toLocaleString("fa")}

              <Icon name="star"></Icon>
            </span>
          </span>

          <span>
            <span> امتیاز </span>

            <span>
              از مجموع
              <span> {store.scoreCount.toLocaleString("fa")} </span>
              نظر
            </span>
          </span>
        </div>
      ) : null}

      {comments && comments.length > 0 ? <p>نظرات کاربران</p> : null}

      <ul>
        {comments &&
          comments.length > 0 &&
          comments.map((comment, index) =>
            comment &&
            comment.comment &&
            comment.comment.description &&
            comment.comment.isVisible &&
            comment.comment.isVerified &&
            comment.comment.score ? (
              <CommentComp comment={comment} index={index}></CommentComp>
            ) : null,
          )}
      </ul>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
