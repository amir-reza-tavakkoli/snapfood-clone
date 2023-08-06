import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "@remix-run/react"

import { routes } from "../routes"

import {
  ALLOWED_URLS,
  COOKIE_ADDRESS,
  COOKIE_City,
  DEFAULT_CITY,
} from "../constants"

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
    if (ALLOWED_URLS.includes(location.pathname)) {
      return
    }

    const choosedAddressId = Number(localStorage.getItem(COOKIE_ADDRESS))

    if (!choosedAddressId) {
      const redirectDelay = 2000 // ms

      setTimeout(() => navigate(routes.addresses), redirectDelay)
      return
    }

    if (choosedAddressId !== addressState) setAddressState(choosedAddressId)
  })

  return { addressState, setAddressState }
}
