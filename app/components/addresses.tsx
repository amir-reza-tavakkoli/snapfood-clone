import { useEffect, useState } from "react"

import { Link, useOutletContext, useSearchParams } from "@remix-run/react"

import type { Address } from "@prisma/client"

import { Icon } from "./icon"

type AddressesProps = {
  addresses: Address[] | null
}

export function Addresses({ addresses }: AddressesProps) {
  const [searchParams] = useSearchParams()
  const [HomeAddressState, setHomeAddressState] = useOutletContext<any>()

  const [addressId, setAddressId] = useState(-1)

  function setChosenAddress(addressId: number, cityName: string) {
    try {
      localStorage.setItem("addressId", addressId.toString())
      localStorage.setItem("city", cityName.toString())
      setHomeAddressState()
      setAddressId(addressId)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAddressId(Number(localStorage.getItem("addressId")))
    }
  }, [addressId])

  return (
    <ul className="addresses">
      <div>
        <Link
          to="\"
          aria-label="Back To Previous"
          onClick={() => {
            history.back()
          }}
        >
          <Icon name="flash" color="action"></Icon>
        </Link>
        <p>انتخاب آدرس</p>
      </div>
      <div>
        <p className="nonvisual">Availible Addresses</p>
        {addresses?.map((address, index) => (
          <li key={index}>
            <input
              className="_choosed"
              type="radio"
              aria-label="Choosed"
              checked={addressId == address.id}
              onChange={() => setChosenAddress(address.id, address.cityName)}
            />
            <p aria-label="address">
              {"شهر" +
                " " +
                address.cityName +
                " " +
                address.address +
                " " +
                "واحد" +
                " " +
                address.unit}
            </p>
            <button className="_delete" aria-label="Remove Address">
              <Icon name="bin" color="error"></Icon>
            </button>
            <Link to={address.id.toString()} aria-label="Edit Address">
              <Icon name="edit" color="action"></Icon>
            </Link>
          </li>
        ))}
      </div>
      <Link to={"/home/addresses/new"}>ایجاد آدرس جدید </Link>
    </ul>
  )
}
