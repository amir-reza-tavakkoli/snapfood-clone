import type { Comment, Item, Order, OrderHasItems } from "@prisma/client"
import { db } from "./db.server"

import { getAddressById } from "./address.query.server"
import { getOrdersInCart } from "./cart.query.server"
import { getItem } from "./item.query.server"
import { getStore, getStoreItems } from "./store.query.server"
import { getUserByPhone } from "./user.query.server"

export type FullOrderStore = {
  id: number
  createdAt: Date
  updatedAt: Date
  totalPrice: number
  taxPercent: number
  packagingPrice: number
  estimatedDeliveryTime: number
  addressId: number

  isBilled: boolean
  isInCart?: boolean
  isVerifiedByAdmin?: boolean
  isVerifiedByStore?: boolean
  isShipped?: boolean
  isDelivered?: boolean
  isCanceled?: boolean
  isDelayedByStore?: boolean

  storeId?: number
  storeKindName?: string
  name?: string
  branchName?: string | null
  description?: string | null
  avatarUrl?: string | null
  cityName?: string
  minOrderPrice?: number
  shipmentPrice?: number
}

export type FullOrderItem = {
  storeId?: number
  id?: number
  itemId?: number
  orderId?: number
  count?: number
  createdAt?: Date
  updatedAt?: Date
  price?: number
  name?: string
  description?: string | null
  avatarUrl?: string | null
  basePrice?: number | null
  itemCategoryName?: any
  discountPercent?: number | null
  remainingCount?: number
  estimatedReadyTime?: number
  isAvailible?: boolean
  isVerified?: boolean
}

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
  estimatedDeliveryTime,
  isBilled,
  isCanceled,
  isDelayedByStore,
  isDelivered,
  isInCart,
  isShipped,
  isVerifiedByAdmin,
  isVerifiedByStore,
  packagingPrice,
  shipmentPrice,
  taxPercent,
  totalPrice,
}: {
  userPhoneNumber: string
  storeId: number
  addressId: number
  estimatedDeliveryTime: number
  isBilled?: boolean
  isCanceled?: boolean
  isDelayedByStore?: boolean
  isDelivered?: boolean
  isInCart?: boolean
  isShipped?: boolean
  isVerifiedByAdmin?: boolean
  isVerifiedByStore?: boolean
  packagingPrice: number
  shipmentPrice: number
  taxPercent: number
  totalPrice: number
}): Promise<Order> {
  try {
    const store = await getStore({ storeId })

    if (!store || !store.isAvailible || !store.isVerified) {
      throw new Error("قروشگاه در دسترس نیست")
    }

    const address = await getAddressById({ addressId })

    if (!address || !address.isAvailible || !address.isValid) {
      throw new Error("آدرس مجاز نیست")
    }

    if (address.cityName !== store.cityName) {
      throw new Error("در یک شهر قرار ندارند")
    }

    // need to evaluate shipment price dynamically and check for availibility of distance

    const user = await getUserByPhone({ phoneNumber: userPhoneNumber })

    if (!user || user.isSuspended || !address.isAvailible) {
      throw new Error("کاربر مجاز نیست")
    }

    const ordersInCart = await getOrdersInCart({
      phoneNumber: user.phoneNumber,
    })

    if (
      ordersInCart &&
      ordersInCart.find(
        orderInCart => orderInCart.storeId == storeId && !orderInCart.isBilled,
      )
    ) {
      throw new Error("سفارش در جریان است")
    }

    const newOrder = await db.order.create({
      data: {
        userPhoneNumber,
        storeId,
        addressId,
        estimatedDeliveryTime,
        isBilled: false,
        isCanceled,
        isDelayedByStore,
        isDelivered,
        isInCart,
        isShipped,
        isVerifiedByAdmin,
        isVerifiedByStore,
        packagingPrice,
        shipmentPrice,
        taxPercent,
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
  estimatedDeliveryTime,
  isBilled,
  isCanceled,
  isDelayedByStore,
  isDelivered,
  description,
  isInCart,
  isShipped,
  isVerifiedByAdmin,
  isVerifiedByStore,
  packagingPrice,
  shipmentPrice,
  taxPercent,
  totalPrice,
}: {
  id: number
  userPhoneNumber?: string
  storeId?: number
  addressId?: number
  description? :string
  estimatedDeliveryTime?: number
  isBilled?: boolean
  isCanceled?: boolean
  isDelayedByStore?: boolean
  isDelivered?: boolean
  isInCart?: boolean
  isShipped?: boolean
  isVerifiedByAdmin?: boolean
  isVerifiedByStore?: boolean
  packagingPrice?: number
  shipmentPrice?: number
  taxPercent?: number
  totalPrice?: number
}): Promise<Order> {
  try {
    const order = await getOrder({ orderId: id })

    if (!order) {
      throw new Error("سقارشی وجود ندارد")
    }

    if (order.isDelivered) {
      throw new Error("سفارش  از قبل کامل شده است")
    }

    if (order.isCanceled) {
      throw new Error("سفارش کنسل شده است")
    }

    const store = await getStore({ storeId: order.storeId })

    if (!store || !store.isAvailible || !store.isVerified) {
      throw new Error("قروشگاه در دسترس نیست")
    }

    const address = await getAddressById({ addressId: order.addressId })

    if (!address || !address.isAvailible || !address.isValid) {
      throw new Error("آدرس مجاز نیست")
    }

    if (address.cityName !== store.cityName) {
      throw new Error("در یک شهر قرار ندارند")
    }

    // need to evaluate shipment price dynamically and check for availibility of distance

    const user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    if (!user || user.isSuspended) {
      throw new Error("کاربر مجاز نیست")
    }

    const newOrder = await db.order.update({
      where: { id },
      data: {
        userPhoneNumber,
        storeId,
        addressId,
        estimatedDeliveryTime,
        isBilled,
        isCanceled,
        isDelayedByStore,
        isDelivered,
        isInCart,
        isShipped,
        isVerifiedByAdmin,
        isVerifiedByStore,
        packagingPrice,
        shipmentPrice,
        taxPercent,
        totalPrice,
        dsescription :  description
      },
    })
    return newOrder
  } catch (error) {
    throw error
  }
}

export type ChangeOrderItemState = "add" | "set" | "remove"

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
    const item = await getItem({ itemId })

    if (!item || !item.isAvailible || !item.isVerified) {
      throw new Error("چنین آیتمی وجود ندارد")
    }

    const order = await getOrder({ orderId })

    if (!order || order.isCanceled) {
      throw new Error("چنین سفارشی وجود ندارد")
    }

    if (order.isDelivered) {
      throw new Error("Order Alreafy Delivered")
    }

    if (
      order.isCanceled ||
      !order.isVerifiedByAdmin ||
      !order.isVerifiedByStore
    ) {
      throw new Error("مشکلی در ثبت سفارش بوجود آمد")
    }

    const store = await getStore({ storeId: order?.storeId })

    if (!store || !store.isAvailible || !store.isVerified) {
      throw new Error("چنین سفارشی وجود ندارد")
    }

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
      throw new Error("چنین آیتمی وجود ندارد")
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
      if (
        itemInStore.remainingCount < count ||
        count == 0 ||
        itemInStore.remainingCount < 0
      ) {
        throw new Error("تعداد ناکافی")
      }

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
        throw new Error("")
      }

      const newItemInOrder = await db.orderHasItems.create({
        data: {
          orderId,
          itemId,
          count,
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
          throw new Error("تعداد ناکافی")
        }

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
          throw new Error("چنین آیتمی وجود ندارد")
        }

        const newCount = itemInOrder.count + count
        if (newCount < 0) {
          throw new Error("تعداد ناکافی")
        }

        if (newCount == 0) {
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
          throw new Error("چنین آیتمی وجود ندارد")
        }

        return newItemInOrder
      }
      case "set": {
        if (count == 0) {
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

        if (
          (count && itemInStore.remainingCount < itemInOrder.count + count) ||
          count == 0
        ) {
          throw new Error("تعداد ناکافی")
        }

        if (itemInStore.remainingCount + itemInOrder.count - count < 0) {
          throw new Error("تعداد ناکافی")
        }

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
      throw new Error("چنین سفارشی وجود ندارد")
    }

    if (
      order.isCanceled ||
      order.isBilled ||
      !order.isVerifiedByStore ||
      !order.isVerifiedByAdmin
    ) {
      throw new Error("مشکلی در ثبت سفارش بوجود آمد")
    }

    const user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    if (user.credit < order.totalPrice || user.credit < 0) {
      throw new Error("کمبود وجه")
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
        },
      }),
    ])

    if (!updatedUser || !updatedOrder) {
      throw new Error("Could Not Perform The Operation")
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
      throw new Error("چنین سفارشی وجود ندارد")
    }

    const orderItems = await getFullOrderItems({ orderId })

    if (!orderItems || orderItems.length == 0) {
      throw new Error("سفارش خالی است")
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

    totalPrice +=
      order.shipmentPrice +=
      order.packagingPrice +=
        totalPrice * order.taxPercent

    if (totalPrice < 0) {
      throw new Error("قیمت اشتباه است")
    }

    if (order.totalPrice == totalPrice || order.isBilled) {
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

export async function getFullOrderItems({
  orderId,
}: {
  orderId: number
}): Promise<(FullOrderItem | undefined)[]> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Error("چنین سفارشی وجود ندارد")
    }

    const storeHasItems = await getStoreItems({ storeId: order.storeId })

    const orderHasItems = (await getOrderItems({ orderId })).itemsInOrder

    const fullOrderItems = orderHasItems.map(itemInOrder => {
      let itemInStore = storeHasItems.items.find(
        item => item?.id == itemInOrder.itemId,
      )

      let mergedItems =
        storeHasItems.itemsInStore.find(
          itemInStore => itemInStore.itemId == itemInOrder.itemId,
        ) ?? undefined

      const fullMergedItems: FullOrderItem | undefined = mergedItems
        ? { ...mergedItems, ...itemInOrder, ...itemInStore }
        : undefined

      return fullMergedItems
    })

    return fullOrderItems
  } catch (error) {
    throw error
  }
}

export async function addComment({
  orderId,
  description,
  isPositive,
  score,
}: Comment): Promise<Comment> {
  try {
    const order = await getOrder({ orderId })

    if (
      !order ||
      !order.isBilled ||
      order.isCanceled ||
      !order.isVerifiedByAdmin ||
      !order.isVerifiedByStore
    ) {
      throw new Error("چنین سفارشی وجود ندارد")
    }

    const user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (comment) {
      throw new Error("Comment Already Exists")
    }

    // need to  evaluate comment

    const newComment = await db.comment.create({
      data: {
        isPositive,
        score,
        description,
        orderId,
      },
    })

    return newComment
  } catch (error) {
    throw error
  }
}

export async function changeComment({
  orderId,
  description,
  isPositive,
  score,
  isVerified,
  isVisible,
  response,
}: Comment): Promise<Comment> {
  try {
    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (!comment) {
      throw new Error("No Such Comment")
    }
    // need to evaluate comment

    const changedComment = await db.comment.update({
      data: {
        isPositive,
        score,
        description,
        isVerified,
        isVisible,
        response,
      },
      where: {
        orderId,
      },
    })

    return changedComment
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

export async function getFullOrderStore({
  orderId,
}: {
  orderId: number
}): Promise<FullOrderStore> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Error("چنین سفارشی وجود ندارد")
    }

    const store = await db.store.findUnique({
      where: {
        id: order.id,
      },
    })

    if (!store) {
      throw new Error("فروشگاهی با این مشخصات وجود ندارد")
    }

    return { ...store, ...order }
  } catch (error) {
    throw error
  }
}

export async function getFullOrdersStore({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<FullOrderStore[]> {
  try {
    const orders = await getOrders({ phoneNumber })

    if (!orders) {
      throw new Error("Not Any Order")
    }

    const fullOrder = await Promise.all(
      orders.map(
        order => getFullOrderStore({ orderId: order.id }),
        //   const store = db.store.findUnique({
        //     where: {
        //       id: order.id,
        //     },
        //   })

        //   if (!store || !order) {
        //     throw new Error("فروشگاهی با این مشخصات وجود ندارد")
        //   }

        //   return { ...store, ...order }
      ),
    )
    console.log("hhh", fullOrder)

    return fullOrder
  } catch (error) {
    throw error
  }
}
