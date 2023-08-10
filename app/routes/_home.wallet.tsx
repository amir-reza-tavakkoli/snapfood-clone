import { useState } from "react"

import {
  Form,
  useActionData,
  useLoaderData,
  V2_MetaFunction,
} from "@remix-run/react"

import {
  ActionArgs,
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import { createOrUpdateUser } from "../queries.server/user.query.server"

import { requireValidatedUser } from "../utils/validate.server"

import { numberToWords } from "@persian-tools/persian-tools"

import type { User } from "@prisma/client"

import { Button } from "../components/button"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { CLIENT_CACHE_DURATION, DEFAULT_CURRENCY } from "../constants"

import pageCss from "./styles/wallet-page.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Wallet`,
        title: `SnappFood Clone Wallet`,
      }
    : { description: "No Wallet found", title: "No Wallet" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type ActionType = { successful?: boolean; unsuccessful?: boolean }

export const action = async ({ request }: ActionArgs): Promise<ActionType> => {
  try {
    const user = await requireValidatedUser(request)

    const form = await request.formData()

    const price = form.get("price")

    if ((!price && typeof price !== "string") || isNaN(Number(price))) {
      throw new Response("فرمت مبلغ ورودی اشتباه است.", { status: 400 })
    }

    const updatedUser = await createOrUpdateUser({
      phoneNumber: user.phoneNumber,
      credit: user.credit + Number(price),
    })

    if (updatedUser) return { successful: true }

    return { unsuccessful: true }
  } catch (error) {
    throw error
  }
}

type LoaderType = User

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    return json(user, {
      headers: {
        "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
      },
    })
  } catch (error) {
    throw error
  }
}

export default function WalletPage() {
  const basePrice = 1000

  const maxPrice = 1000 * basePrice

  const multipliers = [10, 20, 50]

  const user = useLoaderData<typeof loader>() as unknown as LoaderType

  const actionData = useActionData() as unknown as ActionType | undefined

  const [priceToPay, setPriceToPay] = useState(basePrice)

  return (
    <main className="wallet-page">
      <h1>افزایش اعتبار</h1>

      <dl>
        <dt>موجودی فعلی</dt>

        <dd className="_credit">
          {"   " + user.credit.toLocaleString("fa-IR")}
        </dd>

        <dt className="nonvisual">Currency</dt>

        <dd className="_credit">{DEFAULT_CURRENCY}</dd>

        <dt className="nonvisual">Pay</dt>

        <dd>
          <Form method="post">
            <div>
              {multipliers
                ? multipliers.map(multiply => (
                    <Button
                      type="button"
                      onClick={() => setPriceToPay(multiply * basePrice)}
                      aria-label={`Set price to ${multiply * basePrice}`}
                    >
                      {(multiply * basePrice).toLocaleString("fa-IR") +
                        " " +
                        DEFAULT_CURRENCY}
                    </Button>
                  ))
                : null}
            </div>

            <div>
              <Button
                variant="primary"
                aria-label="add"
                type="button"
                onClick={() => {
                  if (priceToPay < basePrice || priceToPay >= maxPrice) {
                    return
                  }

                  setPriceToPay(prev => prev + basePrice)
                }}
              >
                +
              </Button>

              <label htmlFor="price">
                <input
                  id="price"
                  type="text"
                  name="price"
                  required={true}
                  autoComplete="on"
                  min={basePrice}
                  max={maxPrice}
                  value={priceToPay}
                  onChange={e => {
                    if (!isNaN(Number(e.target.value))) {
                      setPriceToPay(Number(e.target.value))
                    }
                  }}
                />

                <span className="nonvisual"> Set price </span>

                <span>{numberToWords(priceToPay) + DEFAULT_CURRENCY}</span>
              </label>

              <Button
                aria-label={`reduce by ${basePrice}`}
                variant="primary"
                type="button"
                onClick={() => {
                  if (priceToPay <= basePrice || priceToPay >= maxPrice) {
                    return
                  }

                  setPriceToPay(prev => prev - basePrice)
                }}
              >
                -
              </Button>
            </div>

            <Button
              aria-label="pay"
              disabled={priceToPay < basePrice}
              variant="accent"
            >
              پرداخت
            </Button>
          </Form>
        </dd>
      </dl>

      <output role="alert" aria-aria-live="assertive">
        {actionData?.successful ? (
          <p className="_success">افزایش اعتبار باموفقیت انجام شد</p>
        ) : null}

        {actionData?.unsuccessful ? (
          <p aria-label="error" className="_error">
            مشکلی پیش آمد
          </p>
        ) : null}
      </output>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
