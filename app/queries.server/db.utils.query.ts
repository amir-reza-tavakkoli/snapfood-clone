import { Order } from "@prisma/client"
import { db } from "../utils/db.server"
import { FullOrderItem } from "./order.query.server"

export function categorizeItems({ items }: { items: FullOrderItem[] }) {
  const itemsInCategory = new Map<string, FullOrderItem[]>()

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

export type OrderStatus =
  | "inCart"
  | "taken"
  | "adminNotVerified"
  | "storeNotVerified"
  | "inProgress"
  | "canceled"
  | "delayed"
  | "shipped"
  | "fullfilled"

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
    throw new Error("")
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

export function f(order: Order) {
  if (!order.billDate) {
    return
  }
  const now = new Date(Date.now());
  const neww = order.billDate.setMinutes(
    order.billDate.getMinutes() + order.estimatedReadyTime,
  );

  (order.billDate > now)
}

export async function deleteUnbilledOrder({ order }: { order: Order }) {
  try {
    if (order.isBilled || order.addressId || !order.isInCart) {
      return
    }

    const threshold = 5 // mins
    const lastUpdate = new Date(order.updatedAt)
    const now = new Date(Date.now())
    lastUpdate.setMinutes(lastUpdate.getMinutes() + threshold)

    if (now < lastUpdate) {
      return
    }

    const deletedOrder = db.order.delete({ where: { id: order.id } })
    return deletedOrder
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
