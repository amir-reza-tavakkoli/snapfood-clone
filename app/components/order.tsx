import { Link } from "@remix-run/react"

import type { Order, Store } from "@prisma/client"

import type { FullOrderItem } from "~/utils/order.query.server"

import { DEFAULT_CURRENCY } from "./../constants"

export type CartCompProps = {
  items: FullOrderItem[]
  order: Order
  store: Store
totalPrice? : number
  dir?: "rtl" | "lrt"
}

export const OrderComp = ({ order, items, store, dir,totalPrice }: CartCompProps) => {
  const total = items.reduce(
    (prev, item) => (item.price ?? 0) * (item.count ?? 0) + prev,
    0,
  )
  return (
    <Link to={`/store/${store.id}`} className="order">
      <ul dir={dir}>
        <li className="_store">
          <img
            src={store.avatarUrl ?? undefined}
            alt=""
            role="presentation"
            className="_store-img"
          />

          <span>
            <p>
              <span className="nonvisual">store Name</span>
              {store.name}
            </p>
          </span>
        </li>

        <li>
          <ul>
            {items.map((item, index) => (
              <li key={index} className="_item">
                <img src={item.avatarUrl ?? undefined} alt=""></img>

                <span className="_item-name">{item.name}</span>

                <span aria-label="Count" className="_count">
                  {(item.count ?? 0).toLocaleString("fa-IR") + "×"}
                </span>

                <span className="_price">
                  {" " +
                    item.price?.toLocaleString("fa-IR") +
                    " " +
                    DEFAULT_CURRENCY}
                </span>
              </li>
            ))}
          </ul>
        </li>

        <li className="_price">
          <span> جمع کل</span>

          <span className="_price">
            {" "}
            {total.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>

        <li>
          <span>هزینه ارسال</span>

          <span className="_price">
            {" "}
            {store.shipmentPrice.toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>

        <li>
          <span>هزینه بسته بندی</span>

          <span className="_price">
            {" "}
            {order.packagingPrice.toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>

        <li className="_discount">
          <span>تخفیف</span>

          <span className="_price">
            {(total - (totalPrice ?? order.totalPrice)).toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>

        <li className="_total">
          <span>مجموع</span>

          <span className="_price">
            {(totalPrice?.toLocaleString("fa-IR") ??
              order.totalPrice.toLocaleString("fa-IR")) +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>
      </ul>
    </Link>
  )
}
