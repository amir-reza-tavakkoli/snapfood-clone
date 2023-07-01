import type { Order,Comment as xxx, Store } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import type { FullOrderItem } from "~/queries.server/order.query.server"
import { getFullOrderItems, getOrder } from "~/queries.server/order.query.server"

import { OrderComp } from "~/components/order"
import { requirePhoneNumber } from "~/utils/session.server"
import { getStore } from "~/queries.server/store.query.server"
import { getUserByPhone } from "~/queries.server/user.query.server"
import {
  validateItems,
  validateNumberParam,
  validateOrder,
  validateStore,
  validateUser,
} from "~/utils/validate.server"
import { getComment } from "~/queries.server/comment.query"
import { Button } from "~/components/button"
import orderCss from "~/components/styles/order.css"
import ordersPageCss from "./styles/orders-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: ordersPageCss },
]

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<{
  order: Order
  items: (FullOrderItem | undefined)[]
  store: Store
  comment: xxx | null
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    const user = await getUserByPhone({ phoneNumber })

    validateUser({ user })

    let order = await getOrder({ orderId })

    order = validateOrder({ order, phoneNumber })

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

export default function Order() {
  const { items, order, store, comment } = useLoaderData<typeof loader>() as unknown as {
    order: Order
    items: FullOrderItem[]
    store: Store
    comment: xxx | null
  }

  return (
    <main className="_order-page">
      <h1>بررسی وضعیت سفارش</h1>
      {items ? (
        <OrderComp comment={comment} order={order} items={items} store={store}></OrderComp>
      ) : null}

    </main>
  )
}
