import { Link } from "@remix-run/react"

import { Button } from "./button"

import { routes } from "../routes"

import { type CartProps, DEFAULT_IMG_PLACEHOLDER } from "../constants"

type OrderProps = CartProps

export const Orders = ({ orders, dir }: OrderProps) => {
  return (
    <ol className="order-summary" dir={dir}>
      <p className="nonvisual">Orders</p>

      {orders
        ? orders.map((order, index) => (
            <li
              data-last={orders.length - 1 == index ? true : undefined}
              aria-label="order"
              key={index}
            >
              <div>
                <Link to={routes.store(order.store.id)}>
                  <img
                    src={order.store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                    alt=""
                    role="presentation"
                    loading="lazy"
                  />

                  <p className="nonvisual">{order.store.name}</p>
                </Link>

                <div className="_identity">
                  <p aria-label="Name">{order.store.name}</p>

                  <time
                    className="_datetime"
                    aria-label="Billed At"
                    dateTime={new Date(
                      order.order.billDate ?? order.order.createdAt,
                    ).toLocaleString("fa-IR")}
                  >
                    {new Date(
                      order.order.billDate ?? order.order.createdAt,
                    ).toLocaleString("fa-IR")}

                    <span className="_space">&nbsp;</span>
                  </time>
                </div>
              </div>

              <div className="_comment" aria-label="Comment">
                {!order.comment ? (
                  <p>
                    <span> نظرتان را درباره این سفارش به اشتراک بگذارید</span>

                    <Link to={routes.comment(order.order.id)}>ثبت نظر</Link>
                  </p>
                ) : (
                  <span>نظر شما با موفقیت ثبت شد</span>
                )}
              </div>

              <span className="_buttons">
                <Link to={routes.order(order.order.id)}>
                  <Button
                    variant="faded"
                    icon={{ name: "info", color: "text" }}
                    type="button"
                  >
                    مشاهده فاکتور
                  </Button>
                </Link>

                <Link to={routes.store(order.store.id)}>
                  <Button
                    variant="faded"
                    icon={{ name: "info", color: "text" }}
                    type="button"
                  >
                    سفارش مجدد
                  </Button>
                </Link>
              </span>
            </li>
          ))
        : null}
    </ol>
  )
}
