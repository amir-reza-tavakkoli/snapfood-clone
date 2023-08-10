import {
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import { useLoaderData, V2_MetaFunction } from "@remix-run/react"

import { getCart } from "../queries.server/cart.query.server"

import { requireValidatedUser } from "../utils/validate.server"

import type { User } from "@prisma/client"

import { CartComp } from "../components/cart"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { Icon } from "../components/icon"

import { CLIENT_CACHE_DURATION, type CartProps } from "../constants"

import cartCss from "./../components/styles/cart.css"
import pageCss from "./styles/orders-page.css"

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

type LoaderType = CartProps | undefined

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = (await requireValidatedUser(request)) as User

    const cart = await getCart({ phoneNumber: user.phoneNumber })

    return json(cart, {
      headers: {
        "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
      },
    })
  } catch (error) {
    throw error
  }
}

export default function CartPage() {
  const cart = useLoaderData<typeof loader>() as LoaderType

  return (
    <main className="orders-page">
      <h1>سفارش‌های من</h1>

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
