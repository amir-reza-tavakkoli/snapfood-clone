import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "@remix-run/react"

import type { Address } from "@prisma/client"

import { COOKIE_ADDRESS, COOKIE_City, DEFAULT_CITY } from "../constants"
import { routes } from "../routes"

export function useForceAddress({
  addresses,
}: {
  addresses: Address[] | null
}) {
  const delay = 2000 // ms

  const allowedRoutes = [
    routes.index,
    routes.addresses,
    routes.login,
    routes.userInfo,
    routes.wallet,
    routes.about,
    routes.search,
    routes.notImplemented,
    routes.cart,
    routes.orders,
    routes.ordersSummary,
    routes.newAddress,
  ]

  const [addressState, setAddressState] = useState<Address | null>()
  const [cityState, setCityState] = useState(DEFAULT_CITY)

  let location = useLocation()

  const navigate = useNavigate()

  useEffect(() => {
    const choosedCity = localStorage.getItem(COOKIE_City)
    if (choosedCity && cityState !== choosedCity) setCityState(choosedCity)
    // console.log("yy", choosedCity, cityState)
  })

  useEffect(() => {
    if (allowedRoutes.includes(location.pathname)) {
      return
    }

    const choosedAddressId = Number(localStorage.getItem(COOKIE_ADDRESS))
    console.log("xx", choosedAddressId)

    if (!choosedAddressId || !addresses || addresses.length === 0) {
      setTimeout(() => navigate(routes.addresses), delay)
      return
    }

    const choosedAddress = addresses.find(
      address => address.id === choosedAddressId,
    )

    if (!choosedAddress) {
      setTimeout(() => navigate(routes.addresses), delay)
      return
    }

    if (!addressState) setAddressState(choosedAddress)

    if (choosedAddressId !== addressState?.id) {
      setAddressState(choosedAddress)
    }
  })

  return { addressState, setAddressState, cityState, setCityState }
}

export function useCheckAddress() {
  const delay = 2000 // ms

  const [addressState, setAddressState] = useState<number>()
  const [citystate, setCityState] = useState(DEFAULT_CITY)

  let location = useLocation()

  const navigate = useNavigate()

  useEffect(() => {
    const choosedCity = localStorage.getItem(COOKIE_City)
    if (choosedCity && citystate !== choosedCity) setCityState(choosedCity)
  })

  useEffect(() => {
    if (location.pathname === routes.addresses) {
      return
    }

    const choosedAddressId = Number(localStorage.getItem(COOKIE_City))
    console.log("ca", choosedAddressId)

    if (!choosedAddressId) {
      setTimeout(() => navigate(routes.addresses), delay)
      return
    }

    if (choosedAddressId !== addressState) setAddressState(choosedAddressId)
  })

  return { addressState, setAddressState }
}
