import { db } from "../utils/db.server"

import type { Address, City } from "@prisma/client"

import { isUnAuthenticated } from "../utils/utils"

import { checkUnit, checkCity } from "../utils/validate.server"

import { evaluateAddress } from "./evaluate.server"

import { UNAUTHENTICATED_USER_ADDRESS } from "../constants"

export async function getUserAddresses({
  phoneNumber,
}: {
  phoneNumber: string
}): Promise<Address[]> {
  try {
    if (isUnAuthenticated(phoneNumber)) {
      ;[UNAUTHENTICATED_USER_ADDRESS]
    }

    const addresses = await db.address.findMany({
      where: {
        userPhoneNumber: phoneNumber,
        isValid: true,
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
    await checkCity({ cityName })

    checkUnit({ unit })

    evaluateAddress({ address, cityName, details, postalCode, title })

    if (unit) unit = Number(unit.toFixed())

    await checkCity({ cityName })

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

    await checkCity({ cityName: previousAddress.cityName })

    if (unit) {
      checkUnit({ unit })

      unit = Number(unit.toFixed())
    }

    evaluateAddress({ address, cityName, details, postalCode, title })

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
