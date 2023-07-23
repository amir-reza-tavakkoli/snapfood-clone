import { useState } from "react"

import { Form, useLoaderData } from "@remix-run/react"

import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/server-runtime"

import { requirePhoneNumber } from "~/utils/session.server"

import { getUserByPhone } from "~/queries.server/user.query.server"

import { requireValidatedUser, validateUser } from "~/utils/validate.server"

import type { User } from "@prisma/client"

import { Button } from "~/components/button"
import { GlobalErrorBoundary } from "~/components/error-boundary"

import { DEFAULT_CURRENCY } from "~/constants"

import orderCss from "./../components/styles/order.css"
import pageCss from "./styles/checkout-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: pageCss },
]

// Prepare to redirect user to bank page
export const action = async ({ request }: ActionArgs) : Promise<User>=> {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    let user = await getUserByPhone({ phoneNumber })

    user = validateUser({ user })

    return user
  } catch (error) {
    throw error
  }
}

export const loader = async ({ request }: LoaderArgs): Promise<User> => {
  try {
    const user = await requireValidatedUser(request)

    return user
  } catch (error) {
    throw error
  }
}

const basePrice = 1000
const multipliers = [10, 20, 50]

export default function WalletPage() {
  const user = useLoaderData<typeof loader>()

  const [priceToPay, setPriceToPay] = useState(basePrice)

  return (
    <main className="_wallet-page">
      <h1>افزایش اعتبار</h1>
      <dl>
        <dt>موجودی فعلی</dt>

        <dd>{user.credit.toLocaleString("fa-IR")}</dd>

        <dt className="nonvisual">Currency</dt>

        <dd>{DEFAULT_CURRENCY}</dd>

        <dt className="nonvisual">Pay</dt>
        <dd>
          <Form>
            {multipliers
              ? multipliers.map(multiply => (
                  <Button
                    type="button"
                    onClick={() => setPriceToPay(multiply * basePrice)}
                    aria-label={`Set price to ${multiply * basePrice}`}
                  >
                    {(multiply * basePrice).toLocaleString("fa-IR") +
                      DEFAULT_CURRENCY}
                  </Button>
                ))
              : null}

            <Button
              aria-label="add"
              type="button"
              onClick={() => setPriceToPay(prev => prev + basePrice)}
            >
              +
            </Button>

            <label htmlFor="price" className="nonvisual">
              Set price to pay
            </label>

            <input
              id="price"
              type="text"
              required={true}
              autoComplete="on"
              value={priceToPay}
              onChange={e => {
                if (!isNaN(Number(e.target.value))) {
                  setPriceToPay(Number(e.target.value))
                }
              }}
            />

            <Button
              aria-label="minus"
              type="button"
              onClick={() => {
                if (priceToPay <= basePrice) {
                  return
                }
                setPriceToPay(prev => prev - basePrice)
              }}
            >
              -
            </Button>

            <Button
              aria-label="pay"
              type="button"
              disabled={priceToPay < basePrice}
            >
              پرداخت
            </Button>
          </Form>
        </dd>
      </dl>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
