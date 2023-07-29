import { LinksFunction, LoaderArgs, redirect } from "@remix-run/server-runtime"
import {
  Form,
  Link,
  useLoaderData,
  useRouteError,
  V2_MetaFunction,
} from "@remix-run/react"

import { requirePhoneNumber } from "../utils/session.server"

import { getUserByPhone } from "../queries.server/user.query.server"

import orderCss from "./../components/styles/order.css"
import pageCss from "./styles/checkout-page.css"

import {
  requireValidatedUser,
  validateNumberParam,
  validateOrder,
  validateStore,
  validateUser,
} from "../utils/validate.server"
import {
  FullOrderItem,
  getFullOrderItems,
  getOrder,
  updateOrder,
} from "../queries.server/order.query.server"
import { Order, Store } from "@prisma/client"
import { getStore } from "../queries.server/store.query.server"
import { Button } from "../components/button"
import { OrderComp } from "../components/order"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { routes } from "../routes"

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

export const action = async ({ request, params }: any) => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    validateUser({ user })

    const form = await request.formData()

    const description: string | undefined = form.get("description")

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = validateOrder({ order, phoneNumber })

    const newOrder = await updateOrder({ id: orderId, description })

    if (newOrder) {
      return redirect(routes.bill(orderId))
    } else {
      throw new Error("خطا")
    }
  } catch (error) {
    throw error
  }
}

type LoaderType = {
  items: FullOrderItem[]
  order: Order
  store: Store
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

    order = validateOrder({ order, phoneNumber: user.phoneNumber })

    if (order.isBilled || order.isCanceled || !order.isInCart) {
      throw new Error("سفارش قبلا تایید شده است")
    }

    let store = await getStore({ storeId: order.storeId })

    store = validateStore({ store })

    const items = await getFullOrderItems({ orderId })

    if (!items) {
      throw new Error("آیتمی وجود ندارد")
    }

    return { items, order, store }
  } catch (error) {
    throw error
  }
}

export default function CheckoutPage() {
  const { items, order, store } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  return (
    <main className="_checkout-page">
      <h1>بررسی و تایید سفارش</h1>

      {items && order ? (
        <>
          <OrderComp order={order} items={items} store={store}></OrderComp>

          <Form method="post" aria-label="Confirm">
            <input type="hidden" name="order-id" value={order.id} />

            <label className="nonvisual" htmlFor="description">
              توضیحات
            </label>

            <textarea
              name="description"
              id="description"
              placeholder="توضیحات سفارش..."
            ></textarea>

            <Button variant="accent" type="submit">
              تایید و ادامه
            </Button>
          </Form>
        </>
      ) : (
        <p>سفارشی وجود ندارد ! </p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
