import { useLoaderData, V2_MetaFunction } from "@remix-run/react"

import {
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Address, Store, storeSchedule } from "@prisma/client"

import {
  getStore,
  getStoreCategories,
  getStoreSchedule,
} from "../queries.server/store.query.server"
import { getAddressById } from "../queries.server/address.query.server"
import { getStoreComments } from "../queries.server/comment.query"

import { getFullAddress, getStoreCurrentSchedule } from "../utils/utils"

import {
  requireValidatedUser,
  validateNumberParam,
} from "../utils/validate.server"

import { Icon } from "../components/icon"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { CommentComp } from "../components/comment"

import {
  CLIENT_CACHE_DURATION,
  DEFAULT_IMG_PLACEHOLDER,
  StoreComment,
} from "../constants"

import commentCss from "./../components/styles/comment.css"
import pageCss from "./styles/store-info-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageCss },
  { rel: "stylesheet", href: commentCss },
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
    const user = await requireValidatedUser(request)

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

  const schedule = getStoreCurrentSchedule(schedules)

  return (
    <main className="store-info">
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

          <Icon name="navigation" color="faded"></Icon>

          <p>{getFullAddress(address)}</p>
        </div>
      </address>

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
            {store.takesOfflineOrder ? "آفلاین" : null}
            ,آنلاین
          </dd>
        </span>

        <span>
          <dt>حداقل سبد خرید</dt>

          <Icon name="cart"></Icon>

          <dd>{store.minOrderPrice.toLocaleString("fa")}</dd>
        </span>
      </dl>

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

      <p>نظرات کاربران</p>

      <ul>
        {comments.map((comment, index) =>
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
