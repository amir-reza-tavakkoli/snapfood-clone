import { Address, Comment, Item, Order, User } from "@prisma/client"
import { db } from "./db.server"
import { getUser } from "./session.server"

export async function getUserByPhone({ phoneNumber }: { phoneNumber: string }) {
  try {
    const user = await db.user.findUnique({
      where: {
        phoneNumber,
      },
    })

    return user
  } catch (error) {
    throw error
  }
}

export async function getOrder({ orderId }: { orderId: number }) {
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

export async function getItem({ itemId }: { itemId: number }) {
  try {
    const item = await db.item.findUnique({
      where: {
        id: itemId,
      },
    })

    return item
  } catch (error) {
    throw error
  }
}

export async function createOrUpdateUser({
  phoneNumber,
  firstName,
  lastName,
  gender,
  birthday,
  email,
  isSuspended,
  isVerified,
}: Pick<
  User,
  | "phoneNumber"
  | "firstName"
  | "lastName"
  | "gender"
  | "birthday"
  | "email"
  | "isSuspended"
  | "isVerified"
>) {
  try {
    if (await getUserByPhone({ phoneNumber })) {
      const user = await db.user.update({
        where: {
          phoneNumber,
        },
        data: {
          firstName,
          lastName,
          gender,
          birthday,
          email,
          isSuspended,
          isVerified,
        },
      })
      return user
    }

    const user = await db.user.create({
      data: {
        phoneNumber,
        firstName,
        lastName,
        gender,
        birthday,
        email,
        isSuspended,
        isVerified,
      },
    })
    return user
  } catch (error) {
    throw error
  }
}

export async function getUserAddresses(phoneNumber: string) {
  try {
    const addresses = await db.address.findMany({
      where: {
        userPhoneNumber: phoneNumber,
      },
    })

    return addresses
  } catch (error) {
    throw error
  }
}

export async function addOrUpdateAddress({
  id,
  userPhoneNumber,
  address,
  cityName,
  details,
  isAvailible,
  isValid,
  title,
  unit,
}: Address) {
  try {
    const isCreated = (await getAddressById(id))!!

    if (isCreated) {
      const newAddress: Address = await db.address.update({
        where: {
          id,
        },
        data: {
          userPhoneNumber,
          address,
          cityName,
          details,
          isAvailible,
          isValid,
          title,
          unit,
        },
      })
      return newAddress
    }

    const newAddress: Address = await db.address.create({
      data: {
        id,
        userPhoneNumber,
        address,
        cityName,
        details,
        isAvailible,
        isValid,
        title,
        unit,
      },
    })

    return newAddress
  } catch (error) {
    throw error
  }
}

export async function getAddressById(addressId: number) {
  try {
    const address = await db.address.findUnique({
      where: {
        id: addressId,
      },
    })

    return address
  } catch (error) {
    throw error
  }
}

export async function updateVerificationCode(
  phoneNumber: string,
  verificationCode: string,
  verificationCodeExpiry: Date,
) {
  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended) {
      throw new Error("User Not Found")
    }

    return await db.user.update({
      where: {
        phoneNumber,
      },
      data: {
        verificationCode,
        verificationCodeExpiry,
      },
    })
  } catch (error) {
    throw error
  }
}

export async function getOrders({
  phoneNumber,
  storeId,
}: {
  phoneNumber?: string
  storeId?: number
}) {
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

    return orders
  } catch (error) {
    throw error
  }
}

export async function getitems({
  orderId,
  storeId,
}: {
  orderId: number
  storeId: number
}) {
  try {
    const items = await db.order.findMany({
      where: {
        id: orderId,
        storeId,
      },
    })

    return items
  } catch (error) {
    throw error
  }
}

export async function updateOrCreateItem({
  id,
  avatarUrl,
  basePrice,
  createdAt,
  description,
  isAvailible,
  isVerified,
  itemCategoryName,
  name,
}: Item) {
  try {
    if (!(await db.item.findUnique({ where: { id } }))) {
      const item = await db.item.create({
        data: {
          id,
          avatarUrl,
          basePrice,
          createdAt,
          description,
          isAvailible,
          isVerified,
          itemCategoryName,
          name,
        },
      })

      return item
    }

    const item = await db.item.update({
      where: {
        id,
      },
      data: {
        avatarUrl,
        basePrice,
        createdAt,
        description,
        isAvailible,
        isVerified,
        itemCategoryName,
        name,
      },
    })

    return item
  } catch (error) {
    throw error
  }
}

export async function getCartItems({ phoneNumber }: { phoneNumber: string }) {
  try {
    const orders = await getOrders({ phoneNumber })

    orders.map(order => (order.isInCart ? order : undefined))

    return orders
  } catch (error) {
    throw error
  }
}

export async function getStore({ storeId }: { storeId?: number }) {
  try {
    const store = await db.store.findUnique({
      where: {
        id: storeId,
      },
    })

    return store
  } catch (error) {
    throw error
  }
}

export async function createOrder({
  id,
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
}: Order) {
  try {
    let order = await db.order.findUnique({
      where: {
        id,
      },
    })

    const store = await getStore({ storeId })

    if (!store || !store.isAvailible || !store.isVerified) {
      throw new Error("Store Unavailible")
    }

    const address = await getAddressById(addressId)

    if (!address || !address.isAvailible || !address.isValid) {
      throw new Error("Address Unavailible")
    }

    const user = await getUserByPhone({ phoneNumber: userPhoneNumber })

    if (!user || user.isSuspended || !address.isAvailible) {
      throw new Error("User Unavailible")
    }

    if (!order) {
      order = await db.order.create({
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
        },
      })
      return order
    }

    order = await db.order.update({
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
      },
    })

    return order
  } catch (error) {
    throw error
  }
}

type State = "add" | "set" | "remove"

export async function changeOrderItems({
  orderId,
  itemId,
  count = 0,
  state,
}: {
  orderId: number
  itemId: number
  count: number
  state: State
}) {
  try {
    const item = await getItem({ itemId })

    if (!item || !item.isAvailible || !item.isVerified) {
      throw new Error("No Such Item")
    }

    const order = await getOrder({ orderId })

    if (!order) {
      throw new Error("No Such Order")
    }

    if (
      order.isCanceled ||
      !order.isVerifiedByAdmin ||
      !order.isVerifiedByStore
    ) {
      throw new Error("Could Not Place The Order")
    }

    const store = await getStore({ storeId: order?.storeId })

    if (!store || !store.isAvailible || !store.isVerified) {
      throw new Error("No Such Order")
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
      itemInStore.remainingCount == null
    ) {
      throw new Error("No Such Item In This Store")
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
      if (itemInStore.remainingCount < count || count == 0) {
        throw new Error("Insufficient Count")
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

        if (itemInStore.remainingCount < count || count == 0) {
          throw new Error("Insufficient Count")
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
          throw new Error("No Such Item In The Store")
        }

        const newCount = itemInOrder.count + count
        if (newCount < 0) {
          throw new Error("Bad Count")
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
          throw new Error("No Such Item In The Order")
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
          throw new Error("Insufficient Count")
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

export async function removeItemFromOrder({
  orderId,
  itemId,
  count,
}: {
  orderId: number
  itemId: number
  count: number
}) {
  try {
    const item = await getItem({ itemId })

    if (!item) {
      throw new Error("No Such Item")
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
      throw new Error("No Such Item In That Order")
    }

    if (count > itemInOrder.count) {
      return await db.orderHasItems.delete({
        where: {
          itemId_orderId: {
            itemId,
            orderId,
          },
        },
      })
    } else {
      return await db.orderHasItems.update({
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
    }
  } catch (error) {
    throw error
  }
}

export async function billOrder({ id }: { id: number }) {
  try {
    const order = await db.order.findUnique({ where: { id } })

    if (!order) {
      throw new Error("No Such Order")
    }

    return await db.order.update({
      where: {
        id,
      },
      data: {
        isBilled: true,
      },
    })
  } catch (error) {
    throw error
  }
}

export async function calculateOrder({ orderId }: { orderId: number }) {
  try {
    const order = await getOrder({ orderId })
    if (!order) {
      throw new Error("No Such Order")
    }

    const items = await db.orderHasItems.findMany({
      where: {
        orderId: orderId,
      },
      orderBy: {
        itemId: "desc",
      },
    })

    if (!items || items.length == 0) {
      throw new Error("No Item In The Order")
    }

    const itemsInStore = await Promise.all(
      items.map(item =>
        db.storeHasItems.findUnique({
          where: {
            storeId_itemId: {
              itemId: item.itemId,
              storeId: order.storeId,
            },
          },
        }),
      ),
    )

    console.log(itemsInStore)

    let totalPrice: number = 0
    itemsInStore.forEach((item, index) => {
      if (!item) {
        return
      }

      if (item.discountPercent) {
        item.price *= item.discountPercent / 100
      }

      totalPrice += item?.price * items[index].count
    })

    totalPrice +=
      order.shipmentPrice +=
      order.packagingPrice +=
        totalPrice * order.taxPercent

    await db.order.update({ where: { id: orderId }, data: { totalPrice } })

    return totalPrice
  } catch (error) {
    throw error
  }
}

export async function addComment({
  orderId,
  description,
  isPositive,
  score,
}: Comment) {
  try {
    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (comment) {
      throw new Error("Comment Already Exists")
    }

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
}: Comment) {
  try {
    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (comment) {
      throw new Error("Comment Already Exists")
    }

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
