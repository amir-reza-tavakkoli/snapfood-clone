import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import { Link, useLoaderData, useRouteError } from "@remix-run/react"

import { requirePhoneNumber } from "~/utils/session.server"

import { getCart } from "~/utils/cart.query.server"
import { getUserByPhone } from "~/utils/user.query.server"

import { CartComp } from "~/components/cart"
import type { CartCompProps } from "~/components/cart"

import cartCss from "./../components/styles/cart.css"
import pageCss from "./styles/orders-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: pageCss },
  { rel: "stylesheet", href: cartCss },
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

    const cart = await getCart({ phoneNumber })

    return cart
  } catch (error) {
    throw error
  }
}

export default function CartPage() {
  const cart = useLoaderData<typeof loader>() as CartCompProps | undefined

  return <main className="_orders-page">
      <p>سفارش‌های من</p>

      {cart && cart.orders ? (
        <CartComp orders={cart.orders}></CartComp>
      ) : (
        <p>سفارشی وجود ندارد ! </p>
      )}
    </main>
}

export function ErrorBoundary() {
  const error = useRouteError()

  const errorMessage = error instanceof Error ? error.message : undefined
  return (
    <div aria-label="error" role="alert" aria-live="assertive">
      <h1>مشکلی پیش آمد!</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}

      <Link to="/orders">دوباره امتحان کنید</Link>
    </div>
  )
}