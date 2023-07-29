import { useRef, useState } from "react"
import type { Address, City } from "@prisma/client"
import {
  Form,
  useActionData,
  useLoaderData,
  useRouteError,
  V2_MetaFunction,
} from "@remix-run/react"

import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import {
  createAddress,
  getAddressById,
  getCities,
  updateAddress,
} from "../queries.server/address.query.server"
import { requirePhoneNumber } from "../utils/session.server"
import { getUserByPhone } from "../queries.server/user.query.server"
import {
  DEAFULT_DIRECTION,
  DEFAULT_CITY,
  DEFAULT_COORDINATIONS,
  DEFAULT_MIN_ADDRESS_LENGTH,
} from "../constants"

import { ClientOnly } from "../client.map"
import { MapComponent } from "../components/map.client"

import { Button } from "../components/button"
import pageCss from "./styles/address-page.css"
import { requireValidatedUser, validateUser } from "../utils/validate.server"

import type { LatLngTuple, Map } from "leaflet"
import { GlobalErrorBoundary } from "../components/error-boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageCss },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.8.0/dist/leaflet.css",
  },
]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: "SnappFood Clone Address",
    title: "SnappFood Clone Address",
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type ActionType = {
  isSuccessful?: boolean
  isUnsuccessful?: boolean
  reason?: string
}

export const action = async ({ request }: any): Promise<ActionType> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const form = await request.formData()

    const addressId: string | undefined = form.get("addressId")
    const cityName: string | undefined = form.get("city")
    const address: string | undefined = form.get("address")
    const title: string | undefined = form.get("title")
    const unit: number | undefined = Number(form.get("unit"))
    const xAxis: number | undefined = Number(form.get("xAxis"))
    const yAxis: number | undefined = Number(form.get("yAxis"))
    const details: string | undefined = form.get("details")

    if (
      !address ||
      !phoneNumber ||
      !addressId ||
      !unit ||
      !Number(addressId) ||
      !cityName ||
      isNaN(xAxis) ||
      isNaN(yAxis)
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

    if (Number(addressId) === -1) {
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
      xAxis,
      yAxis,
      unit: Number(unit),
      details,
    }))

    if (isSuccessful) return { isSuccessful: true }

    return { isUnsuccessful: true }
  } catch (error) {
    throw error
  }
}

type LoaderType = {
  cities: City[]
  address: Address
}

export const loader = async ({
  params,
  request,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

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
        xAxis: 0,
        yAxis: 0,
        postalCode: null,
        isAvailible: false,
        isValid: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        userPhoneNumber: user.phoneNumber,
        details: null,
        title: null,
      }
    } else {
      address = await getAddressById({ addressId: addressId })
    }

    if (!address || (!address.isValid && !isNew)) {
      throw new Error("چنین آدرسی وجود ندارد")
    }

    if (address.userPhoneNumber != user.phoneNumber) {
      throw new Error("دسترسی ندارید")
    }

    const cities = (await getCities()) ?? []

    return { address, cities }
  } catch (error) {
    throw error
  }
}

export default function AddressPage() {
  const { address, cities } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  const result = useActionData() as unknown as ActionType | undefined

  const [addressState, setAddressState] = useState(address.address)
  const [title, setTitle] = useState(address.title)
  const [unit, setUnit] = useState(address.unit)
  const [details, setDetails] = useState(address.details)
  console.log(address)

  const [map, setMap] = useState<Map | null>(null)

  return (
    <main className="_address-page" dir={DEAFULT_DIRECTION}>
      <p>جزییات آدرس</p>

      <Form method="post">
        <p className="nonvisual">Map</p>

        <ClientOnly
          fallback={<div style={{ height: 400, background: "#d1d1d1" }} />}
        >
          {() => (
            <MapComponent
              map={map}
              setMap={setMap}
              height={"400px"}
              initPosition={[
                address.xAxis ?? DEFAULT_COORDINATIONS.xAxis,
                address.yAxis ?? DEFAULT_COORDINATIONS.yAxis,
              ]}
            />
          )}
        </ClientOnly>

        <input type="hidden" name="addressId" value={address.id} />

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

        <output aria-label="error" role="alert" aria-aria-live="assertive">
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

export const ErrorBoundary = GlobalErrorBoundary
