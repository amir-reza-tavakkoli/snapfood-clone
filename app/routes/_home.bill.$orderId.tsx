import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  V2_MetaFunction,
} from "@remix-run/react"

import {
  ActionArgs,
  json,
  LinksFunction,
  LoaderArgs,
  redirect,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Order, Store, User } from "@prisma/client"

import { CartComp } from "../components/cart"
import { Button } from "../components/button"
import { GlobalErrorBoundary } from "../components/error-boundary"

import {
  billOrder,
  calculateOrder,
  getJoinedOrderItems,
  getOrder,
  updateOrder,
} from "../queries.server/order.query.server"
import {
  getStore,
  getStoreSchedule,
} from "../queries.server/store.query.server"
import { getAddressById } from "../queries.server/address.query.server"

import {
  validateNumberParam,
  checkOrder,
  checkStore,
  requireValidatedUser,
} from "../utils/validate.server"

import { validateOrderPossibility } from "../utils/utils"

import { routes } from "../routes"

import {
  CLIENT_CACHE_DURATION,
  DEFAULT_CURRENCY,
  type JoinedOrderItem,
} from "../constants"

import cartCss from "./../components/styles/cart.css"
import pageCss from "./styles/bill-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cartCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Order From Store ${
          data.store.name ?? ""
        }`,
        title: `SnappFood Clone Order From Store ${data.store.name ?? ""}`,
      }
    : { description: "No Order found", title: "No Order" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type ActionType = {
  isUnsuccessful?: boolean
  error?: Response
}

export const action = async ({
  request,
  params,
}: ActionArgs): Promise<ActionType | TypedResponse<never>> => {
  try {
    const user = await requireValidatedUser(request)

    const orderId = Number(params.orderId)

    if (!orderId || isNaN(orderId)) {
      throw new Response("مشکلی پیش آمد")
    }

    const order = await getOrder({ orderId })

    if (!order || order.userPhoneNumber != user.phoneNumber) {
      throw new Response("مشکلی پیش آمد")
    }

    let store = await getStore({ storeId: order.storeId })

    store = checkStore({ store })

    const form = await request.formData()

    const isOffline = String(form.get("offline")).toString() === "offline"

    if (isOffline && !store.takesOfflineOrder) {
      throw new Response("فروشگاه آفلاین نیست")
    }

    if (!isOffline && order.priceToPay && order.priceToPay > user.credit) {
      throw new Response("اعتبار شما کافی نیست")
    }

    const address = await getAddressById({ addressId: order.addressId })

    const schedules = await getStoreSchedule({ store })

    const storeAddress = await getAddressById({ addressId: store.id })

    validateOrderPossibility({ address, order, schedules, store, storeAddress })

    const isSuccessful = !isOffline
      ? !!(await billOrder({ orderId }))
      : await updateOrder({
          id: order.id,
          isBilled: true,
          billDate: new Date(Date.now()),
          isOrderOffline: true,
        })

    if (isSuccessful) return redirect(routes.order(orderId))
    else
      return {
        isUnsuccessful: true,
      }
  } catch (error: any) {
    return {
      isUnsuccessful: true,
      error,
    }
  }
}

type LoaderType = {
  user: User
  order: Order
  price: number
  store: Store
  items: JoinedOrderItem[]
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = checkOrder({ order, phoneNumber: user.phoneNumber })

    let price: number = order.totalPrice

    if (!price || price === 0) {
      price = await calculateOrder({ orderId })
    }

    if (price == null || price == undefined) {
      throw new Response("امکان محاسبه وجود ندارد")
    }

    let store = await getStore({ storeId: order.storeId })

    store = checkStore({ store })

    const items = await getJoinedOrderItems({ orderId })

    if (!items || items.length === 0) {
      throw new Response("مشکلی پیش آمد")
    }

    const address = await getAddressById({ addressId: order.addressId })

    const schedules = await getStoreSchedule({ store })

    const storeAddress = await getAddressById({ addressId: store.id })

    validateOrderPossibility({ address, order, schedules, store, storeAddress })

    return json(
      { user, order, price, store, items },
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

export default function BillPage() {
  const { user, order, price, store, items } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  const actionData = useActionData() as unknown as ActionType | undefined

  return (
    <main className="bill-page" aria-label="Bill">
      <h1> پرداخت سفارش </h1>

      {!order.isBilled ? (
        <div className="_price">
          <p>
            اعتبار مانده :
            {" " + user.credit.toLocaleString("fa") + " " + DEFAULT_CURRENCY}
          </p>

          <p>
            هزینه سفارش
            {" " + (order.priceToPay!.toLocaleString("fa")) + " " + DEFAULT_CURRENCY}
          </p>

          <Link to={routes.wallet} className="_wallet">افزایش اعتبار</Link>
        </div>
      ) : null}

      <div>
        <CartComp orders={[{ items, order, store }]}></CartComp>

        <Form method="post">
          <Button
            variant="accent"
            type="submit"
            disabled={user.credit < (order.priceToPay ?? order.totalPrice) || order.isBilled}
          >
            پرداخت سفارش از اعتبار
          </Button>
        </Form>
      </div>

      {store.takesOfflineOrder ? (
        <div>
          <CartComp orders={[{ items, order, store }]}></CartComp>

          <Form method="post">
            <input type="hidden" name="offline" value="yes" />
            <Button variant="accent" type="submit">
              خرید آفلاین
            </Button>
          </Form>
        </div>
      ) : null}

      <output role="alert" aria-aria-live="assertive">
        {(actionData && !actionData.isUnsuccessful) || order.isBilled ? (
          <p className="_success" aria-label="success">
            با موفقیت پرداخت شد
          </p>
        ) : undefined}

        {actionData && actionData.isUnsuccessful ? (
          <p className="_error" aria-label="error">
            مشکلی پیش آمد
            <span>
              {actionData.error
                ? actionData?.error?.status?.toLocaleString("fa")
                : null}
            </span>
          </p>
        ) : undefined}
      </output>

      <Link to={routes.order(order.id)}>بازگشت به صفحه سفارش</Link>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
