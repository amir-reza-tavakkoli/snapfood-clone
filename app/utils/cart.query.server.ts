import type { Order } from "@prisma/client"
import type { FullOrderItem } from "./order.query.server"

import { getFullOrderItems, getOrders } from "./order.query.server"

export async function getCart({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<(FullOrderItem | undefined)[][] | undefined> {
  try {
    const orders = await getOrdersInCart({ phoneNumber })

    if (!orders || orders.length == 0) {
      return undefined
    }

    const cart = await Promise.all(
      orders.map(order => getFullOrderItems({ orderId: order.id })),
    )

    return cart
  } catch (error) {
    throw error
  }
}

export async function getOrdersInCart({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<Order[] | undefined> {
  try {
    let orders = await getOrders({ phoneNumber })

    if (!orders || orders.length == 0) {
      return undefined
    }

    orders = orders.filter(order => order.isInCart)

    return orders
  } catch (error) {
    throw error
  }
}

export async function getStoreOrderInCart({
  phoneNumber,
  storeId,
}: {
  phoneNumber: string
  storeId: number
}): Promise<Order | undefined> {
  try {
    let orders = await getOrders({ phoneNumber, storeId })

    if (!orders || orders.length == 0) {
      return undefined
    }

    let order = orders.find(order => order.isInCart && !order.isBilled)

    return order
  } catch (error) {
    throw error
  }
}
