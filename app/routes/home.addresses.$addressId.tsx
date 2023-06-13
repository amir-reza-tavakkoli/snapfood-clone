import { Address, City } from "@prisma/client"
import {
  Form,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"
import { useState } from "react"
import {
  createAddress,
  getAddressById,
  getCities,
  updateAddress,
} from "~/utils/address.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { DEFAULT_CITY } from "./home._index"

const MIN_ADDRESS_LENGTH = 10

export const action = async ({
  request,
}: any): Promise<{
  isSuccessful?: boolean
  isUnsuccessful?: boolean
  reason?: string
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const form = await request.formData()

    const addressId: string | undefined = form.get("addressId")
    const cityName: string | undefined = form.get("city")
    const address: string | undefined = form.get("address")
    const title: string | undefined = form.get("title")
    const unit: number | undefined = Number(form.get("unit"))
    const details: string | undefined = form.get("details")

    if (
      !address ||
      !phoneNumber ||
      !addressId ||
      !unit ||
      !Number(addressId) ||
      !cityName
    ) {
      return {
        isUnsuccessful: true,
        reason: "Enter Required Fileds",
      }
    }

    if (address.length < MIN_ADDRESS_LENGTH || Number(unit) == 0) {
      return {
        isUnsuccessful: true,
        reason: "Address Must Be 10 Characters Long",
      }
    }

    if (Number(addressId) == -1) {
      await createAddress({
        address,
        cityName,
        userPhoneNumber: phoneNumber,
        unit,
        details,
        title,
      })
      return { isSuccessful: true }
    }

    const isSuccessful = !!(await updateAddress({
      id: Number(addressId),
      address,
      title,
      unit: Number(unit),
      details,
    }))
    //   : Promise<isSuccessful: boolean >

    if (isSuccessful) return { isSuccessful: true }

    return { isUnsuccessful: true }
  } catch (error) {
    throw error
  }
}

export const loader = async ({
  params,
  request,
}: LoaderArgs): Promise<{
  cities: City[]
  address: Address
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("Invalid User")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("User Is Not Verified Or Suspended")
    }

    let isNew = false
    if (params.addressId === "new") {
      isNew = true
    }

    if (!params.addressId) {
      throw new Error("No Such Address")
    }

    const addressId = Number(params.addressId)

    if (
      (isNaN(addressId) && !isNew) ||
      (typeof addressId !== "number" && !isNew)
    ) {
      throw new Error("Invalid Address")
    }

    let address: Address | null

    if (isNew) {
      address = {
        address: "",
        cityName: DEFAULT_CITY,
        unit: 0,
        id: -1,
        isAvailible: false,
        isValid: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        userPhoneNumber: user.phoneNumber,
        details: "",
        title: "",
      }
    } else {
      address = await getAddressById({ addressId: addressId })
    }

    if (!address || (!address.isValid && !isNew)) {
      throw new Error("No Such Address")
    }

    if (address.userPhoneNumber != phoneNumber) {
      throw new Error("You Are Not Permitted")
    }

    const cities = (await getCities()) ?? []

    return { address, cities }
  } catch (error) {
    throw error
  }
}

export default function Affresses() {
  const { address, cities } = useLoaderData<typeof loader>()
  const result = useActionData()

  const [addressState, setAddressState] = useState(address.address)
  const [title, setTitle] = useState(address.title)
  const [unit, setUnit] = useState(address.unit)
  const [details, setDetails] = useState(address.details)

  return (
    <>
      <Form method="post">
        <input type="text" name="addressId" hidden value={address.id} />

        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          value={addressState}
          onChange={e => {
            e.preventDefault()

            setAddressState(e.target.value)
          }}
        />

        <select name="city" id="city">
          {cities?.map(city => (
            <option value={city.name} selected={city.name === address.cityName}>
              {city.name}
            </option>
          ))}
        </select>

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title ?? ""}
          onChange={e => {
            e.preventDefault()

            setTitle(e.target.value)
          }}
        />

        <label htmlFor="unit">Unit</label>
        <input
          type="text"
          name="unit"
          id="unit"
          value={unit}
          onChange={e => {
            e.preventDefault()
            if (isNaN(Number(e.target.value))) {
              return undefined
            }
            setUnit(Number(e.target.value))
          }}
        />

        <label htmlFor="details">details</label>
        <textarea
          name="details"
          id="details"
          value={details ?? ""}
          onChange={e => {
            e.preventDefault()

            setDetails(e.target.value)
          }}
        />
        {/*
        <label htmlFor=""></label>
        <input type="text" name="" id="" /> */}

        <button type="submit" disabled={!unit || !address}>
          Submit
        </button>
        {result && result.isSuccessful ? <p>Updated</p> : undefined}
        {result && result.isUnsuccessful ? (
          <p>Not Updated{" : " + result.reason}</p>
        ) : undefined}
      </Form>
    </>
  )
}
