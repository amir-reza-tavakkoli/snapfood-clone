import type {
  Order,
  Store,
  Comment,
  Address,
  storeSchedule,
} from "@prisma/client"
import { useLoaderData, V2_MetaFunction } from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import {
  getFullOrderItems,
  getOrder,
} from "../queries.server/order.query.server"

import { OrderComp } from "../components/order"

import {
  getStore,
  getStoreSchedule,
} from "../queries.server/store.query.server"

import {
  requireValidatedUser,
  validateItems,
  validateNumberParam,
  validateOrder,
  validateStore,
} from "../utils/validate.server"

import { getComment } from "../queries.server/comment.query"
import { getAddressById } from "../queries.server/address.query.server"

import { GlobalErrorBoundary } from "../components/error-boundary"

import { getStoreCurrentSchedule } from "../utils/utils"

import type { FullOrderItem } from "../constants"

import orderCss from "../components/styles/order.css"
import orderStatusCss from "./../components/styles/order-status.css"
import pageCss from "./styles/order-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: orderStatusCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Order From Store ${
          data.store.name ?? ""
        }`,
        title: `SnappFood Clone Order From Store ${data.store.name ?? ""}`,
      }
    : { description: "No Order found", title: "No Order" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = {
  order: Order
  items: FullOrderItem[]
  store: Store
  comment: Comment | null
  address: Address
  schedule: storeSchedule[]
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = validateOrder({ order, phoneNumber: user.phoneNumber })

    let store = await getStore({ storeId: order.storeId })

    store = validateStore({ store })

    let items = await getFullOrderItems({ orderId })

    items = validateItems({ items })

    const comment = await getComment({ orderId })

    const address = await getAddressById({ addressId: order.addressId })

    if (!address || address.cityName !== store.cityName) {
      throw new Response("آدرس صحیح نیست", { status: 404 })
    }

    const schedule = await getStoreSchedule({ store })

    if (!order.isBilled && (!schedule || !getStoreCurrentSchedule(schedule))) {
      throw new Response("فروشگاه در دسترس نیست", { status: 404 })
    }

    return { items, order, store, comment, address, schedule }
  } catch (error) {
    throw error
  }
}

export default function OrderPage() {
  const { items, order, store, comment, address, schedule } =
    useLoaderData() as unknown as LoaderType

  return (
    <main className="order-page">
      <h1>
        بررسی سفارش
        <span className="nonvisual">از فروشگاه {store.name}</span>
      </h1>

      {items ? (
        <OrderComp
          comment={comment}
          order={order}
          items={items}
          store={store}
          address={address}
          schedule={schedule}
        ></OrderComp>
      ) : (
        <p className="_error">چنین سفارشی وجود ندارد.</p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
