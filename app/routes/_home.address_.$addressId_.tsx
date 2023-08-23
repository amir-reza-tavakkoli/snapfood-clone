import { useState } from "react"

import type { Address, City } from "@prisma/client"

import {
  Form,
  useActionData,
  useLoaderData,
  V2_MetaFunction,
} from "@remix-run/react"

import {
  ActionArgs,
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import {
  createAddress,
  getAddressById,
  getCities,
  updateAddress,
} from "../queries.server/address.query.server"

import { requirePhoneNumber } from "../utils/session.server"

import { requireValidatedUser } from "../utils/validate.server"

import type { Map } from "leaflet"

import { evaluateAddress } from "../queries.server/evaluate.server"

import { ClientOnly } from "../client.map"

import { MapComponent } from "../components/map.client"
import { Button } from "../components/button"
import { GlobalErrorBoundary } from "../components/error-boundary"

import {
  CLIENT_CACHE_DURATION,
  DEAFULT_DIRECTION,
  DEFAULT_CITY,
  DEFAULT_COORDINATIONS,
  DEFAULT_MIN_ADDRESS_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../constants"

import pageCss from "./styles/address-page.css"

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

export const action = async ({ request }: ActionArgs): Promise<ActionType> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const form = await request.formData()

    const addressId = form.get("addressId")
    const cityName = form.get("city")
    const address = form.get("address")
    const title = form.get("title")
    const details = form.get("details")
    const unit: number | undefined = Number(Number(form.get("unit")).toFixed())
    const xAxis: number | undefined = Number(form.get("xAxis"))
    const yAxis: number | undefined = Number(form.get("yAxis"))

    if (
      !address ||
      !phoneNumber ||
      !addressId ||
      !unit ||
      !Number(addressId) ||
      !cityName ||
      isNaN(xAxis) ||
      isNaN(yAxis) ||
      (details && typeof details !== "string") ||
      (cityName && typeof cityName !== "string") ||
      (address && typeof address !== "string") ||
      (title && typeof title !== "string") ||
      (addressId && typeof addressId !== "string")
    ) {
      return {
        isUnsuccessful: true,
        reason: "فیلد های ضروری را پر کنید",
      }
    }

    evaluateAddress({ address, cityName, title, details })

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
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    let isNew = false

    if (params.addressId === "new") {
      isNew = true
    }

    if (!params.addressId) {
      throw new Response("چنین آدرسی وجود ندارد")
    }

    const addressId = Number(params.addressId)

    if (
      (isNaN(addressId) && !isNew) ||
      (typeof addressId !== "number" && !isNew)
    ) {
      throw new Response("آدرس اشتباه است")
    }

    let address: Address | null

    if (isNew) {
      address = {
        address: "",
        cityName: DEFAULT_CITY,
        unit: 0,
        id: -1,
        xAxis: DEFAULT_COORDINATIONS.xAxis,
        yAxis: DEFAULT_COORDINATIONS.yAxis,
        postalCode: null,
        isAvailible: true,
        isValid: true,
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
      throw new Response("چنین آدرسی وجود ندارد")
    }

    if (address.userPhoneNumber != user.phoneNumber) {
      throw new Response("دسترسی ندارید")
    }

    const cities = await getCities()

    if (!cities) {
      throw new Response("مشکلی پیش آمد", { status: 404 })
    }

    return json(
      { address, cities },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
        },
      },
    )
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

  const [map, setMap] = useState<Map | null>(null)

  return (
    <main className="address-page" dir={DEAFULT_DIRECTION}>
      <h1>جزییات آدرس</h1>

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

          <textarea
            required
            minLength={DEFAULT_MIN_ADDRESS_LENGTH}
            maxLength={MAX_DESCRIPTION_LENGTH}
            autoComplete="street-address"
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
            {cities.map((city, index) => (
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
            required
            autoComplete="unit"
            type="text"
            name="unit"
            inputMode="numeric"
            id="unit"
            minLength={1}
            value={unit}
            onChange={e => {
              e.preventDefault()

              if (isNaN(Number(e.target.value))) {
                return undefined
              }

              setUnit(Number(Number(e.target.value).toFixed()))
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

        <Button
          variant="accent"
          type="submit"
          disabled={!unit || !address || addressState === ""}
          spining={true}
          reactTo={[result]}
        >
          ثبت
        </Button>

        <output aria-label="error" role="alert" aria-live="assertive">
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
