import type {
  Item,
  Order,
  Store,
  OrderHasItems,
  StoreHasItems,
} from "@prisma/client"
import { db } from "./db.server"

import type { FullOrderItem } from "./order.query.server"
import { getFullOrderItems, getOrders } from "./order.query.server"
import { getUserByPhone } from "./user.query.server"

export async function getCart({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<{
  orderInfo: {
    order: Order
    item: OrderHasItems[]
    store: Store | null
    itemdetails: (Item | null)[]
  }[]
} | null> {
  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("No Such User")
    }

    const ordersInCart = await getOrdersInCart({ phoneNumber })

    if (!ordersInCart) {
      return null
    }

    const cart = await Promise.all(
      ordersInCart.map(order =>
        db.orderHasItems.findMany({
          where: {
            orderId: order.id,
          },
          orderBy: {
            itemId: "desc",
          },
        }),
      ),
    )

    const items = await Promise.all(
      cart.map(
        async order =>
          await Promise.all(
            order.map(item =>
              db.item.findUnique({
                where: {
                  id: item.itemId,
                },
              }),
            ),
          ),
      ),
    )

    const stores = await Promise.all(
      ordersInCart.map(order =>
        db.store.findUnique({
          where: {
            id: order.storeId,
          },
        }),
      ),
    )

    let orderInfo = ordersInCart.map((item, index) => {
      return {
        order: item,
        item: cart[index],
        store: stores[index],
        itemdetails: items[index],
      }
    })

    return { orderInfo }
  } catch (error) {
    throw error
  }
}

export async function getFullCart({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<(FullOrderItem | undefined)[][] | undefined> {
  try {
    const orders = await getOrdersInCart({ phoneNumber })

    if (!orders || orders?.length == 0) {
      return
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

    if (!orders) {
      return undefined
    }

    orders = orders.filter(order => order.isInCart)

    return orders
  } catch (error) {}
}

export async function getOrderInCart({
  phoneNumber,
  storeId,
}: {
  phoneNumber: string
  storeId: number
}): Promise<Order | undefined> {
  try {
    let orders = await getOrders({ phoneNumber, storeId })

    if (!orders) {
      return undefined
    }

    let order = orders.find(order => order.isInCart)

    return order
  } catch (error) {}
}
