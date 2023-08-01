import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "@remix-run/react"

import type { Address } from "@prisma/client"

import { routes } from "../routes"

import {
  ALLOWED_URLS,
  COOKIE_ADDRESS,
  COOKIE_City,
  DEFAULT_CITY,
} from "../constants"

export function useForceAddress({
  addresses,
}: {
  addresses: Address[] | null
}) {
  const [addressState, setAddressState] = useState<Address | null>()

  const [cityState, setCityState] = useState(DEFAULT_CITY)

  let location = useLocation()

  const navigate = useNavigate()

  useEffect(() => {
    const choosedCity = localStorage.getItem(COOKIE_City)

    if (choosedCity && cityState !== choosedCity) setCityState(choosedCity)
  })

  useEffect(() => {
    if (ALLOWED_URLS.includes(location.pathname)) {
      return
    }

    const choosedAddressId = Number(localStorage.getItem(COOKIE_ADDRESS))

    if (!choosedAddressId || !addresses || addresses.length === 0) {
      const redirectDelay = 2000 // ms

      setTimeout(() => navigate(routes.addresses), redirectDelay)
      return
    }

    const choosedAddress = addresses.find(
      address => address.id === choosedAddressId,
    )

    if (!choosedAddress) {
      const redirectDelay = 2000 // ms

      setTimeout(() => navigate(routes.addresses), redirectDelay)
      return
    }

    if (!addressState) setAddressState(choosedAddress)

    if (choosedAddressId !== addressState?.id) {
      setAddressState(choosedAddress)
    }
  })

  return { addressState, setAddressState, cityState, setCityState }
}
