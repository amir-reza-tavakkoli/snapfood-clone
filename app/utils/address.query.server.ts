import type {
  Address,
  Comment,
  Item,
  Order,
  Store,
  OrderHasItems,
} from "@prisma/client"
import { db } from "./db.server"

export async function getUserAddresses({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<Address[] | null> {
  try {
    const addresses = await db.address.findMany({
      where: {
        userPhoneNumber: phoneNumber,
      },
      orderBy: { id: "desc" },
    })

    return addresses
  } catch (error) {
    throw error
  }
}

export async function createAddress({
  userPhoneNumber,
  address,
  cityName,
  details,
  isAvailible,
  isValid,
  title,
  unit,
}: {
  userPhoneNumber: string
  address: string
  cityName: string
  details?: string
  isAvailible?: boolean
  isValid?: boolean
  title?: string
  unit: number
}): Promise<Address> {
  try {
    const newAddress = await db.address.create({
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
  } catch (error) {
    throw error
  }
}

export async function updateAddress({
  id,
  userPhoneNumber,
  address,
  cityName,
  details,
  isAvailible,
  isValid,
  title,
  unit,
}: {
  id: number
  userPhoneNumber?: string
  address?: string
  cityName?: string
  details?: string
  isAvailible?: boolean
  isValid?: boolean
  title?: string
  unit?: number
}): Promise<Address> {
  try {
    const previousAddress = await getAddressById({ addressId: id })

    if (!previousAddress) {
      throw new Error("Not Such Address")
    }

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
  } catch (error) {
    throw error
  }
}

export async function getAddressById({
  addressId,
}: {
  addressId: number
}): Promise<Address | null> {
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
