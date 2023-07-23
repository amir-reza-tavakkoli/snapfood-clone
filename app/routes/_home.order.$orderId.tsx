import type { Order, Store, Comment } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import type { FullOrderItem } from "~/queries.server/order.query.server"
import {
  getFullOrderItems,
  getOrder,
} from "~/queries.server/order.query.server"

import { OrderComp } from "~/components/order"
import { requirePhoneNumber } from "~/utils/session.server"
import { getStore } from "~/queries.server/store.query.server"
import { getUserByPhone } from "~/queries.server/user.query.server"
import {
  requireValidatedUser,
  validateItems,
  validateNumberParam,
  validateOrder,
  validateStore,
  validateUser,
} from "~/utils/validate.server"
import { getComment } from "~/queries.server/comment.query"

import orderCss from "~/components/styles/order.css"
import ordersPageCss from "./styles/orders-page.css"
import { GlobalErrorBoundary } from "~/components/error-boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: ordersPageCss },
]

type LoaderType = {
  order: Order
  items: FullOrderItem[]
  store: Store
  comment: Comment | null
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

    order = validateOrder({ order, phoneNumber : user.phoneNumber })

    let store = await getStore({ storeId: order.storeId })

    store = validateStore({ store })

    let items = await getFullOrderItems({ orderId })

    items = validateItems({ items })

    const comment = await getComment({ orderId })

    return { items, order, store, comment }
  } catch (error) {
    throw error
  }
}

export default function OrderPage() {
  const { items, order, store, comment } =
    useLoaderData() as unknown as LoaderType

  return (
    <main className="_order-page">
      <h1>بررسی وضعیت سفارش</h1>
      {items ? (
        <OrderComp
          comment={comment}
          order={order}
          items={items}
          store={store}
        ></OrderComp>
      ) : (
        <p>چنین سفارشی وجود ندارد.</p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
