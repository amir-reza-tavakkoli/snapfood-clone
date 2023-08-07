import { useLoaderData, V2_MetaFunction } from "@remix-run/react"

import { json, LinksFunction, LoaderArgs, TypedResponse } from "@remix-run/server-runtime"

import { getCart } from "../queries.server/cart.query.server"

import { Orders } from "../components/order-summary"

import { GlobalErrorBoundary } from "../components/error-boundary"

import { requireValidatedUser } from "../utils/validate.server"

import { type CartProps, DEAFULT_DIRECTION, CLIENT_CACHE_DURATION } from "./../constants"

import orderCss from "../components/styles/order-summary.css"
import pageCss from "./styles/orders-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: `SnappFood Clone Orders Summary`,
    title: `SnappFood Clone Orders Summary`,
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = CartProps | undefined

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    const cart = await getCart({ phoneNumber: user.phoneNumber, all: true })

    return json(cart, {
      headers: {
        "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
      },
    })
  } catch (error) {
    throw error
  }
}

export default function OrdersSummaryPage() {
  const cart = useLoaderData<typeof loader>() as unknown as LoaderType

  return (
    <main className="orders-page">
      <h1>سفارش‌ های پیشین</h1>

      {cart && cart.orders ? (
        <Orders orders={cart.orders} dir={DEAFULT_DIRECTION}></Orders>
      ) : (
        <p className="_no-order">سفارشی وجود ندارد ! </p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
