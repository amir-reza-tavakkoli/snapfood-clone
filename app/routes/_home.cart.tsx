import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import {
  Link,
  useLoaderData,
  useRouteError,
  V2_MetaFunction,
} from "@remix-run/react"

import { getCart } from "../queries.server/cart.query.server"

import { CartComp } from "../components/cart"
import type { CartCompProps } from "../components/cart"

import cartCss from "./../components/styles/cart.css"
import pageCss from "./styles/orders-page.css"
import { requireValidatedUser, validateUser } from "../utils/validate.server"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { Icon } from "../components/icon"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: cartCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: `SnappFood Clone Cart `,
    title: `SnappFood Clone Cart`,
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

    const cart = await getCart({ phoneNumber: user.phoneNumber })

    return cart
  } catch (error) {
    throw error
  }
}

export default function CartPage() {
  const cart = useLoaderData<typeof loader>() as LoaderType

  return (
    <main className="_orders-page">
      <p>سفارش‌های من</p>

      {cart && cart.orders ? (
        <CartComp orders={cart.orders}></CartComp>
      ) : (
        <>
          <Icon name="gift" color="faded"></Icon>
          <p> سبد خرید شما خالی است! </p>
        </>
      )}
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
