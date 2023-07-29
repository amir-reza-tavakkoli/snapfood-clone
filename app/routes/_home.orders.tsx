import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { useLoaderData, V2_MetaFunction } from "@remix-run/react"

import { getCart } from "../queries.server/cart.query.server"

import { requireValidatedUser } from "../utils/validate.server"

import { GlobalErrorBoundary } from "../components/error-boundary"
import { CartComp } from "../components/cart"

import type { CartCompProps } from "../components/cart"

import cartCss from "./../components/styles/cart.css"
import pageCss from "./styles/orders-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cartCss },
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

type LoaderType = CartCompProps | undefined

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const cart = await getCart({ phoneNumber: user.phoneNumber, all: true })

    return cart
  } catch (error) {
    throw error
  }
}

export default function OrdersPage() {
  const cart = useLoaderData<typeof loader>() as unknown as LoaderType

  return (
    <main className="_orders-page">
      <p>سفارش‌های من</p>

      {cart && cart.orders ? (
        <CartComp orders={cart.orders}></CartComp>
      ) : (
        <p className="_no-order">سفارشی وجود ندارد ! </p>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
