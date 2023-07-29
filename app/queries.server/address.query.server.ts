import type { Address, City, Store } from "@prisma/client"
import { PER_UNIT_ADDED_TIME, SCORE_ROUNDING } from "~/constants"

import { db } from "../utils/db.server"

import { validateAddress, validateCity } from "../utils/validate.server"

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
  postalCode,
  xAxis,
  yAxis,
  details,
  isAvailible,
  isValid,
  title,
  unit,
}: Partial<Address> & {
  userPhoneNumber: string
  address: string
  cityName: string
  unit: number
}): Promise<Address> {
  try {
    await validateCity({ cityName })

    validateAddress({ address, unit })

    const newAddress = await db.address.create({
      data: {
        userPhoneNumber,
        address,
        cityName,
        details,
        isAvailible,
        postalCode,
        xAxis,
        yAxis,
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
  postalCode,
  xAxis,
  yAxis,
}: Partial<Address> & { id: number }): Promise<Address> {
  try {
    const previousAddress = await getAddressById({ addressId: id })

    if (!previousAddress) {
      throw new Response("آدرس اشتباه است", { status: 404 })
    }

    await validateCity({ cityName: previousAddress.cityName })

    if (address || unit) {
      validateAddress({ address, unit })
    }

    const newAddress: Address = await db.address.update({
      where: {
        id,
      },
      data: {
        address,
        cityName,
        postalCode,
        details,
        isAvailible,
        isValid,
        title,
        unit,
        xAxis,
        yAxis,
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

export async function deleteAddressById({
  addressId,
}: {
  addressId: number
}): Promise<Address | null> {
  try {
    const address = await db.address.delete({
      where: {
        id: addressId,
      },
    })

    return address
  } catch (error) {
    throw error
  }
}

export async function getCities(): Promise<City[] | undefined> {
  try {
    return await db.city.findMany()
  } catch (error) {
    throw error
  }
}

export async function getSupportedCities(): Promise<City[]> {
  try {
    const cities = await db.city.findMany({ where: { isAvailible: true } })

    return cities
  } catch (error) {
    throw error
  }
}

export function calculateShipmentPrice({
  storeAddress,
  store,
  destinationAddress,
}: {
  storeAddress: Address
  store: Store
  destinationAddress: Address
}) {
  const res = Number(
    Math.sqrt(
      (storeAddress.xAxis - destinationAddress.xAxis) ** 2 +
        (storeAddress.yAxis - destinationAddress.yAxis) ** 2,
    ).toPrecision(1),
  )
  console.log(res * 10 * PER_UNIT_ADDED_TIME + store.baseShipmentTime)
  
  return res * 10 * PER_UNIT_ADDED_TIME + store.baseShipmentTime
}

export function calculateShipmentTime({
  storeAddress,
  store,
  destinationAddress,
}: {
  storeAddress: Address
  store: Store
  destinationAddress: Address
}) {
  const res = Number(
    Math.sqrt(
      (storeAddress.xAxis - destinationAddress.xAxis) ** 2 +
        (storeAddress.yAxis - destinationAddress.yAxis) ** 2,
    ).toPrecision(1),
  )
  return res *10* store.perUnitShipmentPrice + store.baseShipmentPrice
}

export function isAddressInRange({
  storeAddress,
  store,
  destinationAddress,
}: {
  storeAddress: Address
  store: Store
  destinationAddress: Address
  }) {
    const res = Number(
    Math.sqrt(
      (storeAddress.xAxis - destinationAddress.xAxis) ** 2 +
        (storeAddress.yAxis - destinationAddress.yAxis) ** 2,
      ).toPrecision(1))
      return store.shipmentRadius! * 10 > res
}
