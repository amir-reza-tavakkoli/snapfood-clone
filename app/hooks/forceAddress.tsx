import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "@remix-run/react"

import type { Address } from "@prisma/client"

import { DEFAULT_CITY } from "~/constants"

export function useForceAddress({
  addresses,
}: {
  addresses: Address[] | null
}) {
  const delay = 2000 // ms

  const [addressState, setAddressState] = useState<Address | null>()
  const [cityState, setCityState] = useState(DEFAULT_CITY)

  let location = useLocation()

  const navigate = useNavigate()

  useEffect(() => {
    const choosedCity = localStorage.getItem("city")
    if (choosedCity && cityState !== choosedCity) setCityState(choosedCity)
  })

  useEffect(() => {
    if (
      location.pathname === "/addresses" ||
      location.pathname === "/" ||
      location.pathname === "/login"
    ) {
      return
    }

    const choosedAddressId = Number(localStorage.getItem("addressId"))

    if (!choosedAddressId || !addresses || addresses.length === 0) {
      setTimeout(() => navigate("/addresses"), delay)
      return
    }

    const choosedAddress = addresses.find(
      address => address.id === choosedAddressId,
    )

    if (!choosedAddress) {
      setTimeout(() => navigate("/addresses"), delay)
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
    const choosedCity = localStorage.getItem("city")
    if (choosedCity && citystate !== choosedCity) setCityState(choosedCity)
  })

  useEffect(() => {
    if (location.pathname === "/addresses") {
      return
    }

    const choosedAddressId = Number(localStorage.getItem("addressId"))
    console.log("ca", choosedAddressId)

    if (!choosedAddressId) {
      setTimeout(() => navigate("/addresses"), delay)
      return
    }

    if (choosedAddressId !== addressState) setAddressState(choosedAddressId)
  })

  return { addressState, setAddressState }
}
