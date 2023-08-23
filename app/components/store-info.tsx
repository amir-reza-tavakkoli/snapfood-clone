import { Icon } from "./icon"
import { Button } from "./button"

import type { Store } from "@prisma/client"

import { Link, useLocation } from "@remix-run/react"

import { routes } from "../routes"

import {
  DEFAULT_CURRENCY,
  DEFAULT_IMG_PLACEHOLDER,
  MAX_SCORE,
} from "../constants"

type StoreCardProps = {
  store: Store
  categories?: string[]
  dir?: "rtl" | "lrt"
  isOpen?: boolean
  deliveryPrice: number
  discount?: number
}

export const StoreInfo = ({
  store,
  deliveryPrice,
  dir,
  categories,
  discount,
  isOpen = true,
}: StoreCardProps) => {
  const location = useLocation()

  return store.name && store ? (
    <>
      <div className="placeholder"></div>

      <dl className="store-info" dir={dir}>
        <div>
          <dt className="nonvisual">Store</dt>

          <dd className="_identity">
            <dl>
              <dt className="nonvisual">Name</dt>

              <dd className="_name">
                <Link to={routes.storeInfo(store.id)}>{store.name}</Link>
              </dd>

              {store.storeKindName ? (
                <>
                  <dt className="nonvisual">Type</dt>

                  <dd className="nonvisual">{store.storeKindName}</dd>
                </>
              ) : null}

              <dt className="nonvisual">Status</dt>

              <dd className={isOpen ? "_status-open" : "_status-closed"}>
                {isOpen ? "باز" : "بسته"}
              </dd>

              {discount && discount > 0 ? (
                <>
                  <dt className="nonvisual">Discount</dt>
                  <dd className="_discount">
                    {" " + discount.toLocaleString("Fa") + "% "}
                  </dd>{" "}
                </>
              ) : null}

              {store.score ? (
                <>
                  <dt className="nonvisual">Rating</dt>

                  <dd className="_rating">
                    <dl>
                      <dt className="nonvisual">Starts</dt>

                      <dd className="_star-icon">
                        {<Icon name="star" role="presentation" />}
                      </dd>

                      {store.score ? (
                        <>
                          <dt className="nonvisual">Value</dt>
                          <dd aria-label="Stars">
                            {store.score.toLocaleString("fa")}
                          </dd>
                        </>
                      ) : null}

                      {store.score ? (
                        <>
                          <dd className="nonvisual">Range</dd>

                          <dt className="nonvisual">
                            / {MAX_SCORE.toLocaleString("fa")}
                          </dt>
                        </>
                      ) : null}

                      {store.scoreCount ? (
                        <>
                          <dt className="nonvisual">Count</dt>
                          <dd className="_rating-count">
                            ( {store.scoreCount.toLocaleString("fa")} نظر)
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
                  width={50}
                  height={50}
                  alt=""
                  loading="lazy"
                  role="presentation"
                  src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
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

          <dt className="nonvisual">Time</dt>

          <dd className="_time">
            <Icon name="timeFlash"></Icon>

            <dd>{isOpen ? "دریافت در سریعترین زمان ممکن" : "بسته"}</dd>
          </dd>

          <dt className="nonvisual">Time</dt>

          <dd className="_time">
            <Icon name="delivery"></Icon>

            <dd>
              ارسال اکسپرس
              {deliveryPrice > 0
                ? " " + deliveryPrice.toLocaleString("fa") + "  " + DEFAULT_CURRENCY
                : "  " + "رایگان"}
            </dd>
          </dd>

          <ol className="_categories">
            {categories
              ? categories.map((category, index) => (
                  <li
                    key={index}
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
    </>
  ) : null
}
