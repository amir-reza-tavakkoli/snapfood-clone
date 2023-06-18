import type { Order, Store } from "@prisma/client"
import { CartComp, CartCompProps } from "~/components/cart"
import Index from "~/routes/_index"
import type { FullOrderItem } from "./order.query.server"

import { getFullOrderItems, getOrders } from "./order.query.server"
import { getStore } from "./store.query.server"

export async function getCart({
  phoneNumber,
  all = false
}: {
    phoneNumber: string; all? : boolean
}): Promise<CartCompProps | undefined> {
  try {
    const orders = all ? await getOrders({phoneNumber, isBilled:true}) :  await getOrdersInCart({ phoneNumber })

    if (!orders || orders.length == 0) {
      return undefined
    }

    const stores = await Promise.all(
      orders.map(order => getStore({ storeId: order.storeId })),
    )

    stores.forEach(store => {
  if(!store) throw new Error("No Store");
})

    const items = await Promise.all(
      orders.map(order => getFullOrderItems({ orderId: order.id })),
    )

    items.forEach(item => {
      if (!item) throw new Error("No Store")
    })


    const x  = orders.map((order, index) => {
      return { store: stores[index], order, items: items[index] }
    })

    return { orders : x } as CartCompProps
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
