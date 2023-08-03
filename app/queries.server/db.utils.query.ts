import type { Order } from "@prisma/client"

import { updateOrder } from "./order.query.server"

import {
  type JoinedOrderItem,
  MAX_ORDER_IN_CART_TIME,
  OrderStatus,
} from "../constants"

export function categorizeItems({ items }: { items: JoinedOrderItem[] }) {
  const itemsInCategory = new Map<string, JoinedOrderItem[]>()

  items.forEach(item => {
    if (itemsInCategory.has(item.itemCategoryName)) {
      itemsInCategory.get(item.itemCategoryName)?.push(item)

      return
    }

    itemsInCategory.set(item.itemCategoryName, [])

    itemsInCategory.get(item.itemCategoryName)?.push(item)
  })

  const categorizedItems = Array.from(itemsInCategory, ([name, value]) => ({
    name,
    value,
  }))

  return categorizedItems
}

export function getOrderStatus({ order }: { order: Order }): {
  status: OrderStatus
} {
  if (order.isCanceled) {
    return {
      status: "canceled",
    }
  }

  if (order.isInCart && !order.isBilled) {
    return {
      status: "inCart",
    }
  }

  if (!order.isBilled) {
    throw new Response("این وضعیت سفارش وجود ندارد", { status: 404 })
  }

  if (!order.isVerifiedByAdmin && !order.isVerifiedByStore) {
    return {
      status: "taken",
    }
  }

  if (!order.isVerifiedByAdmin) {
    return {
      status: "adminNotVerified",
    }
  }

  if (!order.isVerifiedByStore) {
    return {
      status: "storeNotVerified",
    }
  }

  if (order.isDelayedByStore) {
    return { status: "delayed" }
  }

  if (order.isShipped && !order.isDelivered) {
    return { status: "shipped" }
  }

  if (order.isDelivered) {
    return { status: "fullfilled" }
  }

  return {
    status: "inProgress",
  }
}

// export function getInProgressOrderTime(order: Order) {
//   if (getOrderStatus({ order }).status !== "inProgress") {
//     throw new Response("سفارش قبلا تکمیل شده است");
//   }

//   const now = new Date(Date.now());

//   const maxTime = order.billDate!.setMinutes(
//     order.billDate!.getMinutes() + order.estimatedReadyTime,
//   );

//   const remainingReadyTime =

//   return {
//     remainingReadyTime , remainingFullTime
//   }
// }

export async function deleteUnbilledOrder({ order }: { order: Order }) {
  try {
    if (getOrderStatus({ order }).status !== "inCart") {
      return
    }

    const threshold = MAX_ORDER_IN_CART_TIME // mins

    const lastUpdate = new Date(order.updatedAt)

    const now = new Date(Date.now())

    lastUpdate.setMinutes(lastUpdate.getMinutes() + threshold)

    if (now < lastUpdate) {
      return
    }

    return await updateOrder({ id: order.id, isCanceled: true })
  } catch (error) {
    throw error
  }
}

// export async function delayOrder({ order }: { order: Order }) {
//   try {
//     const threshold = 5
//     const lastUpdate = new Date(order.updatedAt)
//     const now = new Date(Date.now())
//     lastUpdate.setMinutes(lastUpdate.getMinutes() + threshold)

//     if (now < lastUpdate) {
//       return
//     }

//     const deletedOrder = db.order.delete({ where: { id: order.id } })
//     return deletedOrder
//   } catch (error) {
//     throw error
//   }
// }
// const now = new Date(Date.now()).getTime()
// const billedAt = order.billDate ? new Date(order.billDate).getTime() : null
// if (billedAt) {
//   const mins = (now - billedAt) * 1000 * 60
//   if (mins > order.estimatedDeliveryTime) {
//     return {
//       status: "toBeDelayed",
//     }
//   }
