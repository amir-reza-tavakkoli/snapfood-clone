import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "@remix-run/react"

import { routes } from "../routes"

import { COOKIE_City, DEFAULT_CITY } from "../constants"

export function useCheckAddress() {
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

    if (!choosedAddressId) {
      const redirectDelay = 2000 // ms

      setTimeout(() => navigate(routes.addresses), redirectDelay)
      return
    }

    if (choosedAddressId !== addressState) setAddressState(choosedAddressId)
  })

  return { addressState, setAddressState }
}
