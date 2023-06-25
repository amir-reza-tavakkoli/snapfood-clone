import { Order, Store } from "@prisma/client"
import { Link, useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { getFullOrderItems, getOrder } from "~/utils/order.query.server"
import type { FullOrderItem } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { getStore } from "~/utils/store.query.server"
import {
  validateItems,
  validateNumberParam,
  validateOrder,
  validateStore,
  validateUser,
} from "~/utils/utils.server"
import { OrderComp } from "~/components/order"

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<{
  order: Order
  items: (FullOrderItem | undefined)[]
  store: Store
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
    return { items, order, store }
  } catch (error) {
    throw error
  }
}

function getOrderStatus({ order }: { order: Order }) {
  if (order.isCanceled) {
    return {
      status: "canceled",
    }
  }

  if (order.isBilled && !order.isInCart) {
    return {
      status: "fullfilled",
    }
  }

  if (order.isBilled && !order.isVerifiedByAdmin) {
    return {
      status: "adminNotVerified",
    }
  }

  if (order.isBilled && !order.isVerifiedByStore) {
    return {
      status: "storeNotVerified",
    }
  }

  if (order.isBilled && order.isInCart) {
    if (order.isDelivered) {
      return { status: "toBeFullfilled" }
    }

    if (order.isDelayedByStore) {
      return {status : "toBeAskedAgain"}
    }

    const now = new Date(Date.now()).getTime()
    const billedAt = order.billDate ? new Date(order.billDate).getTime() : null
    if (billedAt) {
      const mins = (now - billedAt) * 1000 * 60
      if (mins > order.estimatedDeliveryTime) {
        return {
          status: "toBeDelayed",
        }
      }
    }
  }
}

export default function Order() {
  const { items, order, store } = useLoaderData<typeof loader>() as unknown as {
    order: Order
    items: FullOrderItem[]
    store: Store
  }

  return (
    <main>
      <h1>بررسی وضعیت سفارش</h1>
      {items ? (
        <OrderComp order={order} items={items} store={store}></OrderComp>
      ) : null}
    </main>
  )
}
