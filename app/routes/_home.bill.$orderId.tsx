import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react"
import {
  LinksFunction,
  LoaderArgs,
  redirect,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Order, Store, User } from "@prisma/client"

import { CartComp } from "~/components/cart"
import { Button } from "~/components/button"

import {
  billOrder,
  calculateOrder,
  FullOrderItem,
  getFullOrderItems,
  getOrder,
} from "~/queries.server/order.query.server"
import { getUserByPhone } from "~/queries.server/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { getStore } from "~/queries.server/store.query.server"

import { DEFAULT_CURRENCY } from "~/constants"

import cartCss from "./../components/styles/cart.css"
import pageCss from "./styles/bill-order.css"
import { validateNumberParam, validateOrder, validateStore, validateUser } from "~/utils/validate.server"
import { GlobalErrorBoundary } from "~/components/error-boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageCss },
  { rel: "stylesheet", href: cartCss },
]

export const action = async ({
  request,
  params,
}: any): Promise<
  | {
      isUnsuccessful?: boolean
      error?: Error
    }
  | TypedResponse<never>
> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)
    const orderId = Number(params.orderId)

    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    if (!orderId || isNaN(orderId)) {
      throw new Error("مشکلی پیش آمد")
    }

    const order = await getOrder({ orderId })

    if (!order || order.userPhoneNumber != phoneNumber) {
      throw new Error("مشکلی پیش آمد")
    }

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    const isSuccessful = !!(await billOrder({ orderId }))

    if (isSuccessful) {
      return redirect(`home/order/${orderId}`)
    } else {
      return {
        isUnsuccessful: true,
      }
    }
  } catch (error: any) {
    console.log(error)

    return {
      isUnsuccessful: true,
      error,
    }
  }
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<{
  user: User
  order: Order
  price: number
  store: Store
  items: (FullOrderItem | undefined)[]
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = validateOrder({ order, phoneNumber })

    let user = await getUserByPhone({ phoneNumber })

    user = validateUser({ user })

    let price: number = order.totalPrice
    if (!price || price == 0) {
      price = await calculateOrder({ orderId })
    }

    let store = await getStore({ storeId: order.storeId })

    store = validateStore({ store })

    if (price == null || price == undefined) {
      throw new Error("امکان محاسبه وجود ندارد")
    }

    if (store.minOrderPrice > price) {
      throw new Error("سفارش شما به حداقل مجاز نرسیده است")
    }

    const items = await getFullOrderItems({ orderId })

    if (!items || items.length == 0) {
      throw new Error("مشکلی پیش آمد")
    }

    return { user, order, price, store, items }
  } catch (error) {
    throw error
  }
}

export default function BillPage() {
  const { user, order, price, store, items } = useLoaderData<
    typeof loader
  >() as unknown as {
    user: User
    order: Order
    price: number
    store: Store
    items: FullOrderItem[]
  }

  const actionData = useActionData()

  return (
    <main className="_bill-page" aria-label="Bill">
      <h1> پرداخت سفارش </h1>

      {!order.isBilled ? (
        <div>
          <p> اعتبار مانده :{" " + user.credit + " " + DEFAULT_CURRENCY}</p>

          <p> هزینه سفارش {" " + price + " " + DEFAULT_CURRENCY} </p>

          <Link to="/wallet">افزایش اعتبار</Link>
        </div>
      ) : null}

      <div>
        <CartComp orders={[{ items, order, store }]}></CartComp>

        <Form method="post">
          <Button
            variant="accent"
            type="submit"
            disabled={user.credit < price || order.isBilled}
          >
            پرداخت سفارش از اعتبار
          </Button>
        </Form>
      </div>

      <output role="alert" aria-aria-live="assertive">
        {(actionData && actionData.isSuccessful) || order.isBilled ? (
          <p className="_success" aria-label="success">
            با موفقیت پرداخت شد
          </p>
        ) : undefined}

        {actionData && actionData.isUnSuccessful ? (
          <p className="_error" aria-label="error">
            مشکلی پیش آمد {actionData?.error?.message}
          </p>
        ) : undefined}
      </output>

      <Link to={`/order/${order.id}`}>بازگشت به صفحه سفارش</Link>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
