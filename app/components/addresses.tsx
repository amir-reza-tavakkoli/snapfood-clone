import { Form, Link } from "@remix-run/react"

import type { Address } from "@prisma/client"

import { getFullAddress } from "../utils/utils"

import { Icon } from "./icon"

import { useSetAddress } from "../hooks/setAddress"

import { routes } from "../routes"

type AddressesProps = {
  addresses: Address[] | null
  dir?: "lrt" | "rtl"
  setHomeAddress: any
  homeAddress: Address
}

export function Addresses({
  addresses,
  dir,
  setHomeAddress,
  homeAddress,
}: AddressesProps) {
  const { addressId, setAddressId } = useSetAddress({
    addresses,
    setHomeAddress,
  })

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

              <Form action={routes.addresses}>
                <input type="hidden" name="remove" value={address.id} />

                <button className="_delete" type="submit">
                  <span className="nonvisual">Remove</span>

                  <Icon name="bin" color="error"></Icon>
                </button>
              </Form>

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
