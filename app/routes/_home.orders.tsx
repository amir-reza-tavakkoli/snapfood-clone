import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import { Link, useLoaderData } from "@remix-run/react"

import { requirePhoneNumber } from "~/utils/session.server"
import cartCss from "./../components/styles/cart.css"

import { getCart } from "~/utils/cart.query.server"
import { FullOrderItem } from "~/utils/order.query.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { CartComp, CartCompProps } from "~/components/cart"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cartCss }]

export const loader = async ({
  request,
}: LoaderArgs): Promise<CartCompProps | undefined> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("Invalid User")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("User Is Not Verified Or Suspended")
    }

    const cart = await getCart({ phoneNumber, all: true })


    return cart
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const cart = useLoaderData<typeof loader>()

    return (
      <main className="_orders-page">
        <p>سفارش‌های من</p>
        <CartComp orders={cart.orders}></CartComp>
      </main>
    )
}
