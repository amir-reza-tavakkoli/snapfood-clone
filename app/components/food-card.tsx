import { useEffect, useState } from "react"

import { Form, Link } from "@remix-run/react"

import { Button } from "./button"

import type { Store } from "@prisma/client"

import { routes } from "../routes"

import { COOKIE_City, DEFAULT_IMG_PLACEHOLDER } from "../constants"

type FoodCardProps = {
  name: string
  type: string
  ingredients?: string
  available: boolean
  image?: string
  prices?: {
    variation?: string
    vaule: number
    currency: string
    available: boolean
    discountPercent?: number | null
  }[]
  count: number
  remainingCount: number
  id: number
  address: number
  reRender: React.Dispatch<React.SetStateAction<{}>>
  store: Store
}

export const FoodCard = ({
  name,
  type,
  image,
  ingredients,
  prices,
  available,
  count,
  remainingCount,
  address,
  id,
  reRender,
  store,
}: FoodCardProps) => {
  const [addressState, setAddressstate] = useState(address)

  const [cityName, setCityName] = useState("")

  useEffect(() => {
    const choosedCity = localStorage.getItem(COOKIE_City)

    if (!choosedCity) {
      setCityName("")

      return
    }

    if (choosedCity !== cityName) setCityName(choosedCity)
  })

  useEffect(() => {
    reRender({})
  }, [])

  return (
    <dl className="food-card">
      <div>
        <Link to={routes.itemStore(id, store.id)}>
          <dt className="nonvisual">Item</dt>

          <dl className="_identity">
            <dt className="nonvisual">Name</dt>

            <dd className="_name">{name}</dd>

            <dt className="nonvisual">Type</dt>

            <dd className="nonvisual">{type}</dd>

            {ingredients ? (
              <>
                <dt className="nonvisual" aria-label="Description">
                  Ingredients
                </dt>

                <dd className="_ingredients">{ingredients}</dd>
              </>
            ) : null}
          </dl>

          <img
            src={image ?? DEFAULT_IMG_PLACEHOLDER}
            alt=""
            role="presentation"
          />
        </Link>
      </div>

      {prices!.map((item, index) => (
        <div className="_forms" key={index}>
          {item ? (
            <>
              <dt className="nonvisual">Price</dt>

              <dd>
                <dl className="_price">
                  <dt className="nonvisual">Variation</dt>

                  <dd className="_variation">{item.variation}</dd>

                  <div>
                    {item.discountPercent ? (
                      <>
                        <dt className="nonvisual">Value</dt>

                        <dd aria-label="Before discount">
                          <del>{item.vaule}</del>
                        </dd>

                        <dt className="nonvisual" aria-label="After discount">
                          Value
                        </dt>

                        <dd>
                          {(
                            (item.vaule * (100 - item.discountPercent)) /
                            100
                          ).toLocaleString("fa")}
                        </dd>
                      </>
                    ) : (
                      <>
                        <dt className="nonvisual">Value</dt>

                        <dd>{item.vaule.toLocaleString("fa") + " "}</dd>
                      </>
                    )}

                    <dt className="nonvisual">Currency</dt>

                    <dd>{item.currency}</dd>
                  </div>
                </dl>
              </dd>
            </>
          ) : null}

          <dt className="nonvisual">Add</dt>

          <dd>
            {available && item.available ? (
              <>
                <Form method="post">
                  <span>
                    {count ? count.toLocaleString("fa") + " × " : null}
                  </span>

                  <input type="hidden" name="id" value={id} />

                  <input type="hidden" name="job" value="add" />

                  <input type="hidden" name="address" value={address} />

                  <Button
                    type="submit"
                    disabled={
                      remainingCount === 0 ||
                      !address ||
                      cityName != store.cityName
                    }
                    onClick={() => {
                      reRender({})
                    }}
                  >
                    +
                  </Button>
                </Form>

                <Form method="post">
                  <input type="hidden" name="id" value={id} />

                  <input type="hidden" name="job" value="remove" />

                  <input type="hidden" name="address" value={address} />

                  {!count || cityName !== store.cityName ? undefined : (
                    <Button type="submit" aria-label="Remove">
                      -
                    </Button>
                  )}
                </Form>
              </>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}
