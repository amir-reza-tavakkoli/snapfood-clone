import { Address } from "@prisma/client"
import {
  Form,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"
import { useState } from "react"
import { getAddressById, updateAddress } from "~/utils/address.query.server"

export const action = async ({
  request,
}: any): Promise<{
  isSuccessful?: boolean
  isUnsuccessful?: boolean
}> => {
  try {
    const form = await request.formData()

    const addressId = form.get("addressId")
    const address = form.get("address")
    const title = form.get("title")
    const unit = form.get("unit")
    const details = form.get("details")

    const newAddress = await updateAddress({
      id: Number(addressId),
      address,
      title,
      unit: Number(unit),
      details,
    })
    //   : Promise<isSuccessful: boolean >

    if (newAddress) return { isSuccessful: true }

    return { isUnsuccessful: true }
  } catch (error) {
    throw error
  }
}

export const loader = async ({
  params,
  request,
}: LoaderArgs): Promise<Address> => {
  try {
    const addressId = Number(params.addressId)

    if (!addressId) {
      throw new Error("No Such Address")
    }

    const address = await getAddressById({ addressId })

    if (!address) {
      throw new Error("No Such Address")
    }

    return address
  } catch (error) {
    throw error
  }
}

export default function UserInfo() {
  const address = useLoaderData<typeof loader>()
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
          value={addressState ?? ""}
          onChange={e => {
            e.preventDefault()
            if (e.target.value) {
              setAddressState(e.target.value)
            }
          }}
        />

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title ?? ""}
          onChange={e => {
            e.preventDefault()
            if (e.target.value) {
              setTitle(e.target.value)
            }
          }}
        />

        <label htmlFor="unit">Unit</label>
        <input
          type="text"
          name="unit"
          id="unit"
          value={unit ?? 0}
          onChange={e => {
            e.preventDefault()
            if (e.target.value) {
              setUnit(Number(e.target.value))
            }
          }}
        />

        <label htmlFor="details">details</label>
        <textarea
          name="details"
          id="details"
          value={details ?? ""}
          onChange={e => {
            e.preventDefault()
            if (e.target.value) {
              setDetails(e.target.value)
            }
          }}
        />
        {/*
        <label htmlFor=""></label>
        <input type="text" name="" id="" /> */}

        <button type="submit">Submit</button>
        {result && result.isSuccessful ? <p>Updated</p> : undefined}
        {result && result.isUnsuccessful ? <p>Not Updated</p> : undefined}
      </Form>
    </>
  )
}
