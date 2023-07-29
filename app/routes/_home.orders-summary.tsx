import { useLoaderData, V2_MetaFunction } from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { getCart } from "../queries.server/cart.query.server"

import { Orders } from "../components/order-summary"
import type { CartProps } from "../components/cart"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { requireValidatedUser, validateUser } from "../utils/validate.server"

import { DEAFULT_DIRECTION } from "./../constants"

import orderCss from "../components/styles/order-summary.css"
import pageCss from "./styles/orders-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: `SnappFood Clone Orders`,
    title: `SnappFood Clone Orders`,
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = CartProps | undefined

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const cart = await getCart({ phoneNumber: user.phoneNumber, all: true })

    return cart
  } catch (error) {
    throw error
  }
}

export default function OrdersSummaryPage() {
  const cart = useLoaderData<typeof loader>() as unknown as LoaderType

  return (
    <main className="orders-page">
      <p>سفارش‌ های پیشین</p>

      {cart && cart.orders ? (
        <Orders orders={cart.orders} dir={DEAFULT_DIRECTION}></Orders>
      ) : (
        <p>سفارشی وجود ندارد ! </p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
