import { useEffect, useState } from "react"

import type { Address } from "@prisma/client"

import { COOKIE_ADDRESS, COOKIE_City } from "~/constants"

export function useSetAddress({
  addresses,
  setHomeAddress,
}: {
  addresses: Address[] | null
  setHomeAddress: any
}) {
  const [addressId, setAddressId] = useState(-1)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const choosedAddress = addresses?.find(
        address => address.id === addressId,
      )

      if (!choosedAddress) {
        return
      }

      setHomeAddress(choosedAddress)

      localStorage.setItem(COOKIE_ADDRESS, addressId.toString())

      localStorage.setItem(COOKIE_City, choosedAddress.cityName)
    }
  }, [addressId])

  useEffect(() => {
    setAddressId(Number(localStorage.getItem(COOKIE_ADDRESS)))
  }, [])

    return { addressId, setAddressId }
}
