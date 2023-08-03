import {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  redirect,
} from "@remix-run/server-runtime"

import { Form, useLoaderData, V2_MetaFunction } from "@remix-run/react"

import {
  requireValidatedUser,
  validateNumberParam,
  checkOrder,
  checkStore,
  checkUser,
} from "../utils/validate.server"

import type { Address, Order, Store, storeSchedule } from "@prisma/client"

import {
  getJoinedOrderItems,
  getOrder,
  updateOrder,
} from "../queries.server/order.query.server"
import {
  getStore,
  getStoreSchedule,
} from "../queries.server/store.query.server"
import { getAddressById } from "../queries.server/address.query.server"

import { Button } from "../components/button"
import { OrderComp } from "../components/order"
import { GlobalErrorBoundary } from "../components/error-boundary"

import {
  calculateItemsReadyTime,
  calculateShipmentPrice,
  calculateShipmentTime,
  validateOrderPossibility,
} from "../utils/utils"

import { routes } from "../routes"

import { type JoinedOrderItem } from "../constants"

import orderCss from "./../components/styles/order.css"
import pageCss from "./styles/checkout-page.css"
import { useState } from "react"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Checkout Order From ${
          data.store.name ?? ""
        }`,
        title: `SnappFood Clone Checkout Order From ${data.store.name ?? ""}`,
      }
    : { description: "No Order found", title: "No Order" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

export const action = async ({ request, params }: ActionArgs) => {
  try {
    const user = await requireValidatedUser(request)

    const form = await request.formData()

    const description = form.get("description")

    if (description && typeof description !== "string") {
      throw new Response("توضیحات وجود ندارد", { status: 404 })
    }

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = checkOrder({ order, phoneNumber: user.phoneNumber })

    const newOrder = await updateOrder({ id: orderId, description })

    let store = await getStore({ storeId: order.storeId })

    store = checkStore({ store })

    const address = await getAddressById({ addressId: order.addressId })

    const schedules = await getStoreSchedule({ store })

    const storeAddress = await getAddressById({ addressId: store.id })

    if (!storeAddress || !address) {
      throw new Error("ادرس ها اشتباه هستند")
    }

    validateOrderPossibility({
      address,
      order,
      schedules: schedules,
      store,
      storeAddress,
    })

    if (newOrder) return redirect(routes.bill(orderId))

    throw new Response("مشکلی پیش آمد", { status: 404 })
  } catch (error) {
    throw error
  }
}

type LoaderType = {
  items: JoinedOrderItem[]
  order: Order
  store: Store
  address: Address | null
  schedules: storeSchedule[]
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = checkOrder({ order, phoneNumber: user.phoneNumber })

    let store = await getStore({ storeId: order.storeId })

    store = checkStore({ store })

    const items = await getJoinedOrderItems({ orderId })

    if (!items) {
      throw new Response("آیتمی وجود ندارد", { status: 404 })
    }

    const address = await getAddressById({ addressId: order.addressId })

    const schedules = await getStoreSchedule({ store })

    const storeAddress = await getAddressById({ addressId: store.id })

    if (!storeAddress || !address) {
      throw new Error("ادرس ها اشتباه هستند")
    }

    validateOrderPossibility({
      address,
      order,
      schedules: schedules,
      store,
      storeAddress,
    })

    const estimatedReadyTime = calculateItemsReadyTime({ items, store })

    const estimatedShipmentTime = calculateShipmentTime({
      destinationAddress: address,
      store,
      storeAddress,
    })

    const shipmentPrice = calculateShipmentPrice({
      destinationAddress: address,
      store,
      storeAddress,
    })

    const updatedOrder = await updateOrder({
      id: order.id,
      estimatedReadyTime,
      estimatedShipmentTime,
      shipmentPrice,
    })

    if (!updateOrder) {
      throw new Response("مشکلی پیش آمد")
    }

    return { items, order, store, address, schedules }
  } catch (error) {
    throw error
  }
}

export default function CheckoutPage() {
  const { items, order, store, address, schedules } =
    useLoaderData() as unknown as LoaderType

  const [description, setDescription] = useState(store.description)

  return (
    <main className="checkout-page">
      <h1>بررسی و تایید سفارش</h1>

      {items && order ? (
        <>
          <OrderComp
            order={order}
            items={items}
            store={store}
            address={address}
            schedule={schedules}
            billSection={false}
          ></OrderComp>

          <Form method="post" aria-label="Confirm">
            <input type="hidden" name="order-id" value={order.id} />

            <label className="nonvisual" htmlFor="description">
              توضیحات
            </label>

            <textarea
              name="description"
              id="description"
              placeholder="توضیحات سفارش..."
              value={description ?? undefined}
              onChange={e => {
                if (e.target.value) setDescription(e.target.value)
              }}
            ></textarea>

            <Button variant="accent" type="submit">
              تایید و ادامه
            </Button>
          </Form>
        </>
      ) : (
        <p className="_no-order">سفارشی وجود ندارد ! </p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
