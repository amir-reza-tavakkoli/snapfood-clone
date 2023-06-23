import { useState } from "react"
import type { Address, City } from "@prisma/client"
import {
  Form,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"

import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import {
  createAddress,
  getAddressById,
  getCities,
  updateAddress,
} from "~/utils/address.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { DEAFULT_DIRECTION, DEFAULT_CITY, DEFAULT_MIN_ADDRESS_LENGTH } from "../constants"

import { Button } from "~/components/button"
import addressPageCss from "./styles/address-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: addressPageCss },
]

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
    console.log(cityName, "jjjjj")

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
        reason: "فیلد های ضروری را پر کنید",
      }
    }

    if (address.length < DEFAULT_MIN_ADDRESS_LENGTH || Number(unit) == 0) {
      return {
        isUnsuccessful: true,
        reason: "طول آدرس باید حداقل 10 کاراکتر باشد",
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
      cityName,
      address,
      title,
      unit: Number(unit),
      details,
    }))

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
      throw new Error("چنین کاربری وجود ندارد")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("کاربر مسدود است")
    }

    let isNew = false
    if (params.addressId === "new") {
      isNew = true
    }

    if (!params.addressId) {
      throw new Error("چنین آدرسی وجود ندارد")
    }

    const addressId = Number(params.addressId)

    if (
      (isNaN(addressId) && !isNew) ||
      (typeof addressId !== "number" && !isNew)
    ) {
      throw new Error("آدرس اشتباه است")
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
      throw new Error("چنین آدرسی وجود ندارد")
    }

    if (address.userPhoneNumber != phoneNumber) {
      throw new Error("دسترسی ندارید")
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
    <main className="_address-page" dir={DEAFULT_DIRECTION}>
      <p>جزییات آدرس</p>
      <Form method="post">
        <input type="text" name="addressId" hidden value={address.id} />
        <div>
          <label htmlFor="address">نشانی</label>
          <input
            autoComplete="street-address"
            type="text"
            name="address"
            id="address"
            value={addressState}
            onChange={e => {
              e.preventDefault()
              setAddressState(e.target.value)
            }}
          />
        </div>

        <div>
          <label htmlFor="city">شهر</label>
          <select name="city" id="city" autoComplete="city">
            {cities?.map((city, index) => (
              <option
                key={index}
                value={city.name}
                selected={city.name === address.cityName}
              >
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title">عنوان</label>
          <input
            type="text"
            name="title"
            placeholder="..."
            id="title"
            value={title ?? undefined}
            onChange={e => {
              e.preventDefault()

              setTitle(e.target.value)
            }}
          />
        </div>

        <div>
          <label htmlFor="unit">واحد</label>
          <input
            autoComplete="unit"
            type="text"
            name="unit"
            inputMode="numeric"
            id="unit"
            value={unit}
            onChange={e => {
              e.preventDefault()
              // if (isNaN(Number(e.target.value))) {
              //   return undefined
              // }
              setUnit(Number(e.target.value))
            }}
          />
        </div>

        <div>
          <label htmlFor="details">جزییات</label>
          <textarea
            placeholder="..."
            name="details"
            id="details"
            value={details ?? undefined}
            onChange={e => {
              e.preventDefault()

              setDetails(e.target.value)
            }}
          />
        </div>

        <Button variant="accent" type="submit" disabled={!unit || !address}>
          ثبت
        </Button>

        <output role="alert" aria-aria-live="assertive">
          {result && result.isSuccessful ? (
            <p className="_success">تغییرات ثبت شد</p>
          ) : undefined}

          {result && result.isUnsuccessful ? (
            <p className="_error">مشکلی پیش آمد{" : " + result.reason}</p>
          ) : undefined}
        </output>
      </Form>
    </main>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  const errorMessage = error instanceof Error ? error.message : undefined
  return (
    <div aria-label="error" role="alert" aria-live="assertive">
      <h1>مشکلی پیش آمد!</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}
    </div>
  )
}
