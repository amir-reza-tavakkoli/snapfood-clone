import { Order, Store, StoreHasItems, User } from "@prisma/client"
import { Link, useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import {
  getFullOrderItems,
  getOrder,
  getOrders,
} from "~/utils/order.query.server"
import type { FullOrderItem } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { getStore } from "~/utils/store.query.server"

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<{
  order: Order
  items: (FullOrderItem | undefined)[]
  store : Store
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const orderId = Number(params.orderId)

    if (!orderId || isNaN(orderId)) {
      throw new Error("No Such Order")
    }

    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended) {
      throw new Error("No Such User")
    }

    const order = await getOrder({ orderId })

    if (!order) {
      throw new Error("No Such Order")
    }

    if (order.userPhoneNumber !== phoneNumber) {
      throw new Error("No Permission")
    }

    const items = await getFullOrderItems({ orderId })

    const store = await getStore({ storeId: order.storeId })

    if (!store) {
      throw new Error("No Such Order")
    }

    return { items, order, store }
  } catch (error) {
    throw error
  }
}

export default function Order() {
  const { items, order, store } = useLoaderData<typeof loader>()

  return (
    <div>
      {<Link to={`../store/${order.storeId}`}>Go To Store</Link>}
      {order?.id}
      {order
        ? items.map((item: any, index) => <p key={index}>{item.name}</p>)
        : undefined}
      <>
        {!order?.isBilled ? (
          <Link to={`home/bill/${order.id}`}>Bill</Link>
        ) : undefined}
      </>
      <>{}</>
    </div>
  )
}
