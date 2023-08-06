import { Icon } from "./icon"
import { Button } from "./button"

import type { Store } from "@prisma/client"

import { Link } from "@remix-run/react"

import { routes } from "~/routes"

import { DEFAULT_IMG_PLACEHOLDER } from "../constants"

type StoreCardProps = {
  store: Store
  name: string
  logo?: string
  type?: string
  rating?: {
    value?: number | string
    range?: number
    count?: number
  }
  categories?: string[]
  dir?: "rtl" | "lrt"
  isOpen?: boolean
}

export const StoreInfo = ({
  name,
  logo,
  type,
  rating,
  store,
  dir,
  categories,
  isOpen = true,
}: StoreCardProps) => {
  return (
    <dl className="store-info" dir={dir}>
      <div>
        <dt className="nonvisual">Store</dt>

        <dd className="_identity">
          <dl>
            <dt className="nonvisual">Name</dt>

            <dd className="_name">{name}</dd>

            <dt className="nonvisual">Type</dt>

            <dd className="nonvisual">{type}</dd>

            <dt className="nonvisual">Status</dt>

            <dd className={isOpen ? "_status-open" : "_status-closed"}>
              {isOpen ? "باز" : "بسته"}
            </dd>

            {rating ? (
              <>
                <dt className="nonvisual">Rating</dt>

                <dd className="_rating">
                  <dl>
                    <dt className="nonvisual">Starts</dt>

                    <dd className="_star-icon">
                      {<Icon name="star" role="presentation" />}
                    </dd>

                    {rating.value ? (
                      <>
                        <dt className="nonvisual">Value</dt>
                        <dd aria-label="Stars">
                          {rating.value.toLocaleString("fa")}
                        </dd>
                      </>
                    ) : null}

                    {rating.range ? (
                      <>
                        <dd className="nonvisual">Range</dd>

                        <dt className="nonvisual">
                          / {rating.range.toLocaleString("fa")}
                        </dt>
                      </>
                    ) : null}

                    {rating.count ? (
                      <>
                        <dt className="nonvisual">Count</dt>
                        <dd className="_rating-count">
                          ( {rating.count.toLocaleString("fa")} نظر)
                        </dd>
                      </>
                    ) : null}
                  </dl>
                </dd>
              </>
            ) : null}
          </dl>
        </dd>

        <dt className="nonvisual">Images</dt>

        <dd className="_image">
          <dl>
            <dt className="nonvisual">Logo</dt>

            <dd>
              <img
                alt=""
                loading="lazy"
                role="presentation"
                src={logo ?? DEFAULT_IMG_PLACEHOLDER}
              ></img>
            </dd>
          </dl>
        </dd>
      </div>

      <div>
        <dt className="nonvisual">Information</dt>

        <dd>
          <Button
            variant="primary"
            type="button"
            rounding="full"
            icon={{ name: "info", color: "action" }}
          >
            <Link to={routes.storeInfo(store.id)}>اطلاعات و نظرات</Link>
          </Button>
        </dd>

        <ol className="_categories">
          {categories
            ? categories.map(category => (
                <li
                  className={
                    decodeURI(location.hash) === `#__${category}`
                      ? "_choosed-link"
                      : undefined
                  }
                >
                  <a href={`#__${category}`}>{category}</a>
                </li>
              ))
            : null}
        </ol>
      </div>
    </dl>
  )
}
