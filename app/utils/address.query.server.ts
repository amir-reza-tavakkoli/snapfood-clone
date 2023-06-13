import type { Address, City } from "@prisma/client"
import { db } from "./db.server"

export async function getUserAddresses({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<Address[]> {
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
    const cities = await getCities()

    if (!cities || !cities.find(city => city.name === cityName)) {
      throw new Error("Unsupported City")
    }

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
  address,
  cityName,
  details,
  isAvailible,
  isValid,
  title,
  unit,
}: {
  id: number
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

    const cities = await getCities()

    if (!cities || !cities.find(city => city.name === cityName)) {
      throw new Error("Unsupported City")
    }

    const newAddress: Address = await db.address.update({
      where: {
        id,
      },
      data: {
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

// to be fully implemented by GPS API
export async function getNearestAddress({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<Address | null> {
  try {
    const addresses = await getUserAddresses({ phoneNumber })

    if (!addresses || addresses.length == 0) {
      return null
    }

    return addresses[0]
  } catch (error) {
    throw error
  }
}

export async function getCities(): Promise<City[] | undefined> {
  try {
    return await db.city.findMany()
  } catch (error) {}
}
