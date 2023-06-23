import { Link, useLoaderData } from "@remix-run/react"
import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { requirePhoneNumber } from "~/utils/session.server"

import { getUserByPhone } from "~/utils/user.query.server"

import { Orders } from "~/components/order-summary"

import { DEAFULT_DIRECTION } from "./../constants"
import type { CartCompProps } from "~/components/cart"

import { getCart } from "~/utils/cart.query.server"

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

    if (!user) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("کاربر مسدود است")
    }

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

      {cart && cart.orders  ? (
        <Orders orders={cart.orders} dir={DEAFULT_DIRECTION}></Orders>
      ) : (
        <p>سفارشی وجود ندارد ! </p>
      )}
    </main>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div aria-label="error" role="alert" aria-live="assertive">
      <h1>مشکلی پیش آمد!</h1>

      {error && error.message ? <p>{error.message}</p> : null}

      <Link to="/orders">دوباره امتحان کنید</Link>
    </div>
  )
}
