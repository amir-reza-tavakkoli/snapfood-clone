import { useEffect, useState } from "react"

import { Link, useOutletContext } from "@remix-run/react"

import type { Address } from "@prisma/client"

import { setChosenAddress } from "../utils/utils"
import { getFullAddress, toPersianDigits } from "../utils/utils"

import { routes } from "../routes"

import { Icon } from "./icon"

import { COOKIE_ADDRESS, COOKIE_City } from "../constants"

type AddressesProps = {
  addresses: Address[] | null
  dir?: "lrt" | "rtl"
  setHomeAddress: any
  homeAddress: any
}

export function Addresses({
  addresses,
  dir,
  setHomeAddress,
  homeAddress,
}: AddressesProps) {
  const [addressId, setAddressId] = useState(-1)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const choosedAddress = addresses?.find(a => a.id === addressId)
      if (!choosedAddress) {
        return
      }
      setHomeAddress(choosedAddress)
      localStorage.setItem(COOKIE_ADDRESS, addressId.toString())
      localStorage.setItem(COOKIE_City, choosedAddress?.cityName)
    }
  }, [addressId])

  useEffect(() => {
    setAddressId(Number(localStorage.getItem(COOKIE_ADDRESS)))
  }, [])

  console.log("addresses", addressId)

  return (
    <ul aria-label="address" className="addresses" dir={dir}>
      <div>
        <Link
          to={routes.index}
          onClick={() => {
            history.back()
          }}
        >
          <span className="nonvisual">Back To Previous</span>
          <Icon name="flash" color="action"></Icon>
        </Link>

        <p>انتخاب آدرس </p>
      </div>

      <div>
        <p className="nonvisual">Availible Addresses</p>

        {addresses ? (
          addresses.map((address, index) => (
            <li key={index}>
              <input
                aria-describedby={"__" + address.id}
                className="_choosed"
                type="radio"
                name="choosed"
                aria-label="Choose"
                checked={addressId === address.id}
                onChange={() => setAddressId(address.id)}
              />

              <p aria-label="address" id={"__" + address.id}>
                {getFullAddress(address)}
              </p>

              <Link
                to={routes.address(address.id.toString())}
                className="_delete"
                aria-label="Remove"
              >
                <Icon name="bin" color="error"></Icon>
              </Link>

              <Link
                to={routes.address(address.id.toString())}
                aria-label="Edit"
              >
                <Icon name="edit" color="action"></Icon>
              </Link>
            </li>
          ))
        ) : (
          <p className="_empty">
            <span>!</span>
            آدرسی وجود ندارد
          </p>
        )}
      </div>

      <Link to={routes.newAddress}>
        ایجاد آدرس جدید
        <Icon name="plus" color="action"></Icon>
      </Link>
    </ul>
  )
}
