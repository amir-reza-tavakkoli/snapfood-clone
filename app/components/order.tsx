import { useEffect, useState } from "react"

import { Link } from "@remix-run/react"

import type { Comment, Order, Store } from "@prisma/client"

import type { FullOrderItem } from "../queries.server/order.query.server"

import { routes } from "../routes"

import { DEFAULT_CURRENCY, DEFAULT_IMG_PLACEHOLDER } from "./../constants"

export type CartCompProps = {
  items: FullOrderItem[]
  order: Order
  store: Store
  totalPrice?: number
  dir?: "rtl" | "lrt"
  comment?: Comment | null
  commentSection?: boolean
  billSection?: boolean
}

export const OrderComp = ({
  order,
  items,
  store,
  dir,
  totalPrice,
  comment = null,
  commentSection = false,
  billSection = false,
}: CartCompProps) => {
  const [newTotalPrice, setNewTotalPrice] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [finalPrice, setFinalPrice] = useState(totalPrice ?? 0)

  useEffect(() => {
    let tempPrice = items.reduce(
      (prev, item) => (item.price ?? 0) * (item.count ?? 0) + prev,
      0,
    )

    if (newTotalPrice !== tempPrice) setNewTotalPrice(tempPrice)

    tempPrice =
      ((newTotalPrice -
        totalDiscount +
        store.baseShipmentPrice +
        store.packagingPrice) *
        (100 + store.taxPercent)) /
      100

    if (finalPrice !== tempPrice) setFinalPrice(tempPrice)

    tempPrice = items.reduce(
      (prev, item) =>
        (item.price ?? 0) *
          (item.count ?? 0) *
          ((item.discountPercent ?? 0) / 100) +
        prev,
      0,
    )

    if (totalDiscount !== tempPrice) setTotalDiscount(tempPrice)
  })

  return (
    <Link to={routes.store(store.id)} className="order">
      <ul dir={dir}>
        <li className="_store">
          <img
            src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
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

        {commentSection ? (
          <div className="_comment" aria-label="Comment">
            {!comment ? (
              <p>
                <span> نظرتان را درباره این سفارش به اشتراک بگذارید</span>

                <Link to={routes.comment(order.id)}>ثبت نظر</Link>
              </p>
            ) : (
              <span>نظر شما با موفقیت ثبت شد</span>
            )}
          </div>
        ) : null}

        <li>
          <ul>
            {items.map((item, index) =>
              item && item.count && item.count > 0 ? (
                <li key={index} className="_item">
                  <img
                    src={item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                    alt=""
                  ></img>

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
              ) : null,
            )}
          </ul>
        </li>

        <li className="_price">
          <span> جمع کل</span>

          <span className="_price">
            {newTotalPrice.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>

        <li>
          <span>هزینه ارسال</span>

          <span className="_price">
            {store.baseShipmentPrice.toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>

        <li>
          <span>هزینه بسته بندی</span>

          <span className="_price">
            {store.packagingPrice.toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>

        <li className="_discount">
          <span>تخفیف</span>

          <span className="_price">
            {totalDiscount.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>

        <li className="_total">
          <span>نهایی</span>

          <span className="_price">
            {finalPrice.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>

        {order &&
        store.isVerified &&
        store.isAvailible &&
        billSection &&
        newTotalPrice > store.minOrderPrice ? (
          <li>
            <Link to={routes.checkout(order.id)}> ثبت سفارش</Link>
          </li>
        ) : null}
      </ul>
    </Link>
  )
}
