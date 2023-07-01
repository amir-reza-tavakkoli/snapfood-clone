import { Link } from "@remix-run/react"

import type { Order, Store } from "@prisma/client"

import { FullOrderItem } from "~/queries.server/order.query.server"

import { Button } from "./button"

import { DEFAULT_IMG_PLACEHOLDER } from "~/constants"
import { CartCompProps } from "./cart"

type OrderProps = CartCompProps

export const Orders = ({ orders, dir }: OrderProps) => {
  console.log(orders)

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
                <Link to={`/stores/${order.store.id}`}>
                  <img
                    src={order.store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                    alt=""
                    role="presentation"
                  />

                  <p className="nonvisual">{order.store.name}</p>
                </Link>
                <div className="_identity">
                  <p aria-label="Name">{order.store.name}</p>

                  <time className="_datetime" aria-label="Billed At">
                    {new Date(
                      order.order.billDate ?? order.order.createdAt,
                    ).toLocaleString("fa-IR")}

                    <span className="_space">&nbsp;</span>
                  </time>
                </div>
            </div>

              <div className="_comment" aria-label="Comment">
              {!order.comment ? <p>
                <span> نظرتان را درباره این سفارش به اشتراک بگذارید</span>

                <Link to={`/comment/${order.order.id}`}>ثبت نظر</Link>
              </p> : <span>نظر شما با موفقیت ثبت شد</span>}
              </div>
              <span className="_buttons">
                <Link to={`/order/${order.order.id}`}>
                  <Button
                    variant="faded"
                    icon={{ name: "info", color: "text" }}
                    type="button"
                  >
                    مشاهده فاکتور
                  </Button>
                </Link>

                <Button
                  variant="faded"
                  icon={{ name: "info", color: "text" }}
                  type="button"
                >
                  سفارش مجدد
                </Button>
              </span>
            </li>
          ))
        : null}
    </ol>
  )
}
