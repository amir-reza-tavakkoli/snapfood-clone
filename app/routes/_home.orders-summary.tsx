import { useLoaderData } from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { requirePhoneNumber } from "~/utils/session.server"

import { getUserByPhone } from "~/queries.server/user.query.server"
import { getCart } from "~/queries.server/cart.query.server"

import { Orders } from "~/components/order-summary"
import type { CartCompProps } from "~/components/cart"
import { GlobalErrorBoundary } from "~/components/error-boundary"

import { validateUser } from "~/utils/validate.server"

import { DEAFULT_DIRECTION } from "./../constants"

import orderCss from "~/components/styles/order-summary.css"
import ordersPageCss from "./styles/orders-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: ordersPageCss },
]

export const loader = async ({
  request,
}: LoaderArgs): Promise<CartCompProps | undefined> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    validateUser({ user })

    const cart = await getCart({ phoneNumber, all: true })

    return cart
  } catch (error) {
    throw error
  }
}

export default function Ordersx() {
  const cart = useLoaderData<typeof loader>() as CartCompProps | undefined

  return (
    <main className="_orders-page">
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
