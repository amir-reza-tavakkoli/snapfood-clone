import { Link } from "@remix-run/react"

import type { Comment, Order, Store } from "@prisma/client"

import type { FullOrderItem } from "../queries.server/order.query.server"

import { Icon } from "./icon"

import { DEFAULT_CURRENCY, DEFAULT_IMG_PLACEHOLDER } from "./../constants"

import { routes } from "../routes"

export type CartProps = {
  orders:
    | {
        items: FullOrderItem[]
        order: Order
        store: Store
        comment?: Comment
      }[]
    | undefined

  dir?: "rtl" | "lrt"
}

export const CartComp = ({ orders, dir }: CartProps) => {
  return (
    <ol className="cart" dir={dir}>
      {orders
        ? orders.map((order, index) => (
            <Link to={routes.store(order.store.id)} key={index}>
              <li className="_order">
                <div>
                  <img
                    src={order.store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                    alt=""
                    role="presentation"
                  />

                  <span>
                    <p>
                      <span className="nonvisual">store Name</span>
                      {order.store.name}
                    </p>

                    <time>
                      <Icon name="time" color="faded"></Icon>

                      <span className="nonvisual">Billed At</span>

                      {new Date(
                        order.order.billDate ?? order.order.createdAt,
                      ).toLocaleString("fa-IR")}
                    </time>
                  </span>

                  <p>
                    <span className="nonvisual">Price</span>

                    {order.order.totalPrice.toLocaleString("fa-IR") +
                      " " +
                      DEFAULT_CURRENCY}
                  </p>
                </div>

                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="_item">
                      <img
                        src={item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                        alt=""
                      ></img>

                      <span className="nonvisual">{item.name}</span>

                      <span aria-label="Count">{item.count}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </Link>
          ))
        : null}
    </ol>
  )
}
