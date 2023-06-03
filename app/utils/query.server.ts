import { Address, Item, Order, User } from "@prisma/client"
import { db } from "./db.server"

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
          firstName: firstName ?? undefined,
          lastName: lastName ?? undefined,
          gender: gender ?? undefined,
          birthday: birthday ?? undefined,
          email: email ?? undefined,
          isSuspended: isSuspended ?? undefined,
          isVerified: isVerified ?? undefined,
        },
      })
      return user
    }

    const user = await db.user.create({
      data: {
        phoneNumber,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
        gender: gender ?? undefined,
        birthday: birthday ?? undefined,
        email: email ?? undefined,
        isSuspended: isSuspended ?? undefined,
        isVerified: isVerified ?? undefined,
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

    if (!user) {
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
        userPhoneNumber: phoneNumber ?? undefined,
        storeId: storeId ?? undefined,
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
        id: orderId ?? undefined,
        storeId: storeId ?? undefined,
      },
    })

    return items
  } catch (error) {
    throw error
  }
}

export async function updateItem({
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
}: Order) {
  try {
    const order = await db.order.create({
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
