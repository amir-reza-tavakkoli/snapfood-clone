import { db } from "../utils/db.server"

import type { Item, Order, OrderHasItems } from "@prisma/client"

import { checkStore, checkUser } from "../utils/validate.server"

import { getAddressById } from "./address.query.server"
import { getOrdersInCart } from "./cart.query.server"
import { getItemById } from "./item.query.server"
import { getStore, getStoreItems } from "./store.query.server"
import { getUserByPhone } from "./user.query.server"

import { getOrderStatus } from "./db.utils.query"

import {
  type ChangeOrderItemState,
  type JoinedOrderItem,
  type JoinedOrderStore,
  MAX_ORDER_IN_CART_TIME,
} from "../constants"
import { generateRandomCode } from "~/utils/utils.server"
export async function getOrder({
  orderId,
}: {
  orderId: number
}): Promise<Order | null> {
  try {
    const item = await db.order.findUnique({
      where: {
        id: orderId,
      },
    })

    return item
  } catch (error) {
    throw error
  }
}

export async function getOrders({
  phoneNumber,
  storeId,
  isBilled,
}: {
  phoneNumber?: string
  storeId?: number
  isBilled?: boolean
}): Promise<Order[] | null> {
  try {
    const orders = await db.order.findMany({
      where: {
        userPhoneNumber: phoneNumber,
        storeId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (isBilled) return orders.filter(order => order.isBilled)

    return orders
  } catch (error) {
    throw error
  }
}

export async function createOrder({
  userPhoneNumber,
  storeId,
  addressId,
  isBilled,
  isCanceled,
  isDelayedByStore,
  isDelivered,
  isInCart,
  isShipped,
  isVerifiedByAdmin,
  isVerifiedByStore,
  shipmentPrice,
  estimatedShipmentTime,
  estimatedReadyTime,
  description,
  billDate,
  isOrderOffline,
  paymentNumber,
  totalPrice,
}: Partial<Order> & {
  totalPrice: number
  shipmentPrice: number
  estimatedReadyTime: number
  estimatedShipmentTime: number
  storeId: number
  addressId: number
  userPhoneNumber: string
}): Promise<Order> {
  try {
    let store = await getStore({ storeId })

    store = checkStore({ store })

    const address = await getAddressById({ addressId })

    if (!address || !address.isAvailible || !address.isValid) {
      throw new Response("آدرس مجاز نیست", { status: 404 })
    }

    if (address.cityName !== store.cityName) {
      throw new Response("در یک شهر قرار ندارند", { status: 404 })
    }

    let user = await getUserByPhone({ phoneNumber: userPhoneNumber })

    user = checkUser({ user })

    const ordersInCart = await getOrdersInCart({
      phoneNumber: user.phoneNumber,
    })

    if (
      ordersInCart &&
      ordersInCart.find(
        orderInCart => orderInCart.storeId === storeId && !orderInCart.isBilled,
      )
    ) {
      throw new Response("سفارش در جریان است", { status: 404 })
    }

    const newOrder = await db.order.create({
      data: {
        userPhoneNumber,
        storeId,
        addressId,
        estimatedShipmentTime,
        estimatedReadyTime,
        isBilled: false,
        isCanceled,
        isDelayedByStore,
        isDelivered,
        isInCart,
        isShipped,
        isVerifiedByAdmin,
        description,
        billDate,
        isVerifiedByStore,
        isOrderOffline,
        paymentNumber,
        shipmentPrice,
        totalPrice,
      },
    })

    return newOrder
  } catch (error) {
    throw error
  }
}

export async function updateOrder({
  id,
  userPhoneNumber,
  storeId,
  addressId,
  isBilled,
  isCanceled,
  isDelayedByStore,
  isDelivered,
  description,
  isInCart,
  isOrderOffline,
  paymentNumber,
  isShipped,
  isVerifiedByAdmin,
  isVerifiedByStore,
  estimatedShipmentTime,
  estimatedReadyTime,
  billDate,
  shipmentPrice,

  totalPrice,
}: Partial<Order> & { id: number }): Promise<Order> {
  try {
    const order = await getOrder({ orderId: id })

    if (!order) {
      throw new Response("سفارشی وجود ندارد", { status: 404 })
    }

    const newOrder = await db.order.update({
      where: { id },
      data: {
        userPhoneNumber,
        storeId,
        addressId,
        estimatedShipmentTime,
        estimatedReadyTime,
        isBilled,
        isCanceled,
        isDelayedByStore,
        isDelivered,
        isOrderOffline,
        paymentNumber,
        billDate,
        isInCart,
        isShipped,
        isVerifiedByAdmin,
        isVerifiedByStore,
        shipmentPrice,
        totalPrice,
        description,
      },
    })
    return newOrder
  } catch (error) {
    throw error
  }
}

export async function changeOrderItems({
  orderId,
  itemId,
  count = 0,
  state,
}: {
  orderId: number
  itemId: number
  count: number
  state: ChangeOrderItemState
}): Promise<OrderHasItems> {
  try {
    const item = await getItemById({ itemId })

    if (!item || !item.isAvailible || !item.isVerified) {
      throw new Response("چنین آیتمی وجود ندارد", { status: 404 })
    }

    const order = await getOrder({ orderId })

    if (!order || order.isCanceled) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    if (order.isDelivered) {
      throw new Response("سفارش قبلا ارسال شده", { status: 404 })
    }

    let store = await getStore({ storeId: order?.storeId })

    store = checkStore({ store })

    const itemInStore = await db.storeHasItems.findUnique({
      where: {
        storeId_itemId: {
          storeId: store?.id,
          itemId,
        },
      },
    })

    if (
      !itemInStore ||
      itemInStore.remainingCount == undefined ||
      itemInStore.remainingCount == null ||
      itemInStore.remainingCount < 0
    ) {
      throw new Response("چنین آیتمی وجود ندارد", { status: 404 })
    }

    const itemInOrder = await db.orderHasItems.findUnique({
      where: {
        itemId_orderId: {
          itemId,
          orderId,
        },
      },
    })

    if (!itemInOrder) {
      if (itemInStore.remainingCount < count || count === 0) {
        throw new Response("تعداد ناکافی", { status: 404 })
      }

      if (!itemInStore.infiniteSupply) {
        const newItemInStore = await db.storeHasItems.update({
          where: {
            storeId_itemId: {
              storeId: store.id,
              itemId,
            },
          },
          data: {
            remainingCount: itemInStore.remainingCount - count,
          },
        })

        if (!newItemInStore) {
          throw new Response("آیتم وجود ندارد", { status: 404 })
        }
      }

      const newItemInOrder = await db.orderHasItems.create({
        data: {
          orderId,
          itemId,
          count: Math.abs(count),
        },
      })

      return newItemInOrder
    }

    switch (state) {
      case "add":
      case "remove": {
        if (state === "remove") {
          count *= -1
        }

        if (itemInStore.remainingCount - count < 0) {
          throw new Response("تعداد ناکافی", { status: 404 })
        }

        const newCount = itemInOrder.count + count

        if (newCount < 0) {
          throw new Response("تعداد ناکافی", { status: 404 })
        }

        if (!itemInStore.infiniteSupply) {
          const newItemInStore = await db.storeHasItems.update({
            where: {
              storeId_itemId: {
                storeId: store.id,
                itemId,
              },
            },
            data: {
              remainingCount: itemInStore.remainingCount - count,
            },
          })

          if (!newItemInStore) {
            throw new Response("چنین آیتمی وجود ندارد", { status: 404 })
          }
        }

        if (newCount === 0) {
          const deleted = await db.orderHasItems.delete({
            where: {
              itemId_orderId: {
                itemId,
                orderId,
              },
            },
          })

          return deleted
        }

        const newItemInOrder = await db.orderHasItems.update({
          where: {
            itemId_orderId: {
              itemId,
              orderId,
            },
          },
          data: {
            count: newCount,
          },
        })

        if (!newItemInOrder) {
          throw new Response("چنین آیتمی وجود ندارد", { status: 404 })
        }

        return newItemInOrder
      }

      case "set": {
        if (
          (count && itemInStore.remainingCount < itemInOrder.count + count) ||
          count === 0
        ) {
          throw new Response("تعداد ناکافی", { status: 404 })
        }

        if (itemInStore.remainingCount + itemInOrder.count - count < 0) {
          throw new Response("تعداد ناکافی", { status: 404 })
        }

        if (count === 0) {
          const deleted = await db.orderHasItems.delete({
            where: {
              itemId_orderId: {
                itemId,
                orderId,
              },
            },
          })

          return deleted
        }

        if (!itemInStore.infiniteSupply)
          await db.storeHasItems.update({
            where: {
              storeId_itemId: {
                storeId: store.id,
                itemId,
              },
            },
            data: {
              remainingCount:
                itemInStore.remainingCount + itemInOrder.count - count,
            },
          })

        const newItemInOrder = await db.orderHasItems.update({
          where: {
            itemId_orderId: {
              itemId,
              orderId,
            },
          },
          data: {
            count,
          },
        })

        return newItemInOrder
      }
    }
  } catch (error) {
    throw error
  }
}

export async function getOrderItems({ orderId }: { orderId: number }): Promise<{
  items: (Item | null)[]
  itemsInOrder: OrderHasItems[]
}> {
  try {
    const itemsInOrder = await db.orderHasItems.findMany({
      where: { orderId },
      orderBy: { itemId: "desc" },
    })

    const items = await Promise.all(
      itemsInOrder.map(itemInOrder =>
        db.item.findUnique({
          where: {
            id: itemInOrder.itemId,
          },
        }),
      ),
    )

    return { items, itemsInOrder }
  } catch (error) {
    throw error
  }
}

export async function billOrder({
  orderId,
}: {
  orderId: number
}): Promise<Order> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    if (
      order.isCanceled ||
      order.isBilled ||
      !order.isVerifiedByStore ||
      !order.isVerifiedByAdmin
    ) {
      throw new Response("مشکلی در ثبت سفارش بوجود آمد", { status: 404 })
    }

    let user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    user = checkUser({ user })

    if (user.credit < order.totalPrice || user.credit < 0) {
      throw new Response("کمبود وجه", { status: 404 })
    }

    const [updatedUser, updatedOrder] = await db.$transaction([
      db.user.update({
        where: {
          phoneNumber: user.phoneNumber,
        },
        data: {
          credit: user.credit - order.totalPrice,
        },
      }),
      db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isBilled: true,
          billDate: new Date(Date.now()),
          paymentNumber: generateRandomCode(10), // must come from bank
        },
      }),
    ])

    if (!updatedUser || !updatedOrder) {
      throw new Response("عملیات ممکن نیست", { status: 404 })
    }

    return updatedOrder
  } catch (error) {
    throw error
  }
}

export async function calculateOrder({
  orderId,
}: {
  orderId: number
}): Promise<number> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    const orderItems = await getJoinedOrderItems({ orderId })

    if (!orderItems) {
      throw new Response("سفارش خالی است", { status: 404 })
    }

    let totalPrice: number = 0

    orderItems.forEach(orderItem => {
      if (!orderItem || !orderItem.price || !orderItem.count) {
        return
      }

      let tempPrice = orderItem.price

      if (orderItem.discountPercent) {
        tempPrice *= orderItem.discountPercent / 100
      }

      totalPrice += tempPrice * orderItem.count
    })

    let store = await getStore({ storeId: order.storeId })

    store = checkStore({ store })

    totalPrice +=
      order.shipmentPrice +=
      store.packagingPrice +=
        totalPrice * store.taxPercent

    if (totalPrice < 0) {
      throw new Response("قیمت اشتباه است", { status: 404 })
    }

    if (order.totalPrice === totalPrice || order.isBilled) {
      return totalPrice
    }

    const newOrder = await db.order.update({
      where: { id: orderId },
      data: { totalPrice },
    })

    return totalPrice
  } catch (error) {
    throw error
  }
}

export async function getJoinedOrderItems({
  orderId,
}: {
  orderId: number
}): Promise<JoinedOrderItem[]> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    const storeHasItems = await getStoreItems({ storeId: order.storeId })

    const orderHasItems = (await getOrderItems({ orderId })).itemsInOrder

    const JoinedOrderItems = orderHasItems.map(itemInOrder => {
      let itemInStore = storeHasItems.items.find(
        item => item?.id === itemInOrder.itemId,
      )

      let mergedItems =
        storeHasItems.itemsInStore.find(
          itemInStore => itemInStore.itemId === itemInOrder.itemId,
        ) ?? undefined

      const fullMergedItems: JoinedOrderItem | undefined = mergedItems
        ? { ...mergedItems, ...itemInOrder, ...itemInStore }
        : undefined

      return fullMergedItems
    })

    return JoinedOrderItems as JoinedOrderItem[]
  } catch (error) {
    throw error
  }
}

export async function getNewStoreOrders({
  storeId,
}: {
  storeId: number
}): Promise<Order[] | null> {
  try {
    let orders = await getOrders({ storeId })

    if (orders)
      orders = orders.filter(
        order =>
          order.isBilled &&
          order.isInCart &&
          order.isVerifiedByAdmin &&
          !order.isVerifiedByStore,
      )

    return orders
  } catch (error) {
    throw error
  }
}

export async function getNewOrders({}): Promise<Order[] | null> {
  try {
    let orders = await getOrders({})

    if (orders)
      orders = orders.filter(
        order =>
          order.isBilled &&
          order.isInCart &&
          !order.isVerifiedByAdmin &&
          !order.isVerifiedByStore,
      )

    return orders
  } catch (error) {
    throw error
  }
}

export async function getJoinedOrderStore({
  orderId,
}: {
  orderId: number
}): Promise<JoinedOrderStore> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    const store = await db.store.findUnique({
      where: {
        id: order.id,
      },
    })

    if (!store) {
      throw new Response("فروشگاهی با این مشخصات وجود ندارد", { status: 404 })
    }

    return { ...store, ...order }
  } catch (error) {
    throw error
  }
}

export async function getJoinedOrdersStore({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<JoinedOrderStore[]> {
  try {
    const orders = await getOrders({ phoneNumber })

    if (!orders) {
      throw new Response("سفارشی وجود ندارد", { status: 404 })
    }

    const fullOrder = await Promise.all(
      orders.map(order => getJoinedOrderStore({ orderId: order.id })),
    )

    return fullOrder
  } catch (error) {
    throw error
  }
}

export async function cancelOrder({ order }: { order: Order }) {
  try {
    if (getOrderStatus({ order }).status !== "inCart") {
      return
    }

    const items = await getJoinedOrderItems({ orderId: order.id })

    const store = await getStore({ storeId: order.storeId })

    if (!store) {
      throw new Response("فروشگاهی با این اسم وجود ندارد", { status: 404 })
    }

    const newItems = await Promise.all(
      items.map(async item => {
        if (!item || !item.id || !item.count) {
          throw new Response("آیتم وجود ندارد", { status: 404 })
        }

        const itemInStore = await db.storeHasItems.findUnique({
          where: { storeId_itemId: { itemId: item.id, storeId: store.id } },
        })

        if (!itemInStore) {
          throw new Response("آیتم وجود ندارد", { status: 404 })
        }

        if (!itemInStore.infiniteSupply)
          await db.storeHasItems.update({
            where: { storeId_itemId: { itemId: item.id, storeId: store.id } },
            data: { remainingCount: itemInStore.remainingCount + item.count },
          })
      }),
    )

    if (!newItems) {
      throw new Response("آیتم وجود ندارد", { status: 404 })
    }

    const canceledOrder = await updateOrder({ id: order.id, isCanceled: true })

    return canceledOrder
  } catch (error) {
    throw error
  }
}

export async function shouldOrderCancel({ order }: { order: Order }) {
  try {
    if (getOrderStatus({ order }).status !== "inCart") {
      return
    }

    const lastUpdate = order.updatedAt

    const now = new Date(Date.now())

    lastUpdate.setMinutes(lastUpdate.getMinutes() + MAX_ORDER_IN_CART_TIME)

    if (now > lastUpdate) {
      return await cancelOrder({ order })
    }

    return order
  } catch (error) {
    throw error
  }
}
