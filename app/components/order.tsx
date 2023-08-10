import { useEffect, useState } from "react"

import { Link } from "@remix-run/react"

import { routes } from "../routes"

import { getStoreCurrentSchedule } from "../utils/utils"

import { Button } from "./button"

import { getOrderStatus } from "../queries.server/db.utils.query"

import {
  CartCompProps,
  DEFAULT_CURRENCY,
  DEFAULT_IMG_PLACEHOLDER,
} from "./../constants"
import { OrderStatus } from "./order-status"

export const OrderComp = ({
  order,
  items,
  store,
  dir,
  schedule,
  totalPrice,
  address,
  storeAddress,
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

  const status = getOrderStatus({ order }).status

  return (
    <Link to={routes.store(store.id)} className="order">
      <ul dir={dir}>
        <li className="_store">
          <img
            src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
            alt=""
            role="presentation"
            className="_store-img"
            loading="lazy"
            width={40}
            height={40}
          />

          <time
            className="nonvisual"
            aria-label="Billed At"
            dateTime={new Date(
              order.billDate ?? order.createdAt,
            ).toLocaleString("fa-IR")}
          >
            {new Date(order.billDate ?? order.createdAt).toLocaleString(
              "fa-IR",
            )}
          </time>

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
              item &&
              item.count &&
              ((item.price && item.price > 0) ||
                (item.basePrice && item.basePrice > 0)) ? (
                <li key={index} className="_item">
                  <img
                    src={item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                    alt=""
                    role="presentation"
                    loading="lazy"
                    width={40}
                    height={40}
                  ></img>

                  <span className="_item-name">{item.name}</span>

                  <span aria-label="Count" className="_count">
                    {item.count.toLocaleString("fa-IR") + "×"}
                  </span>

                  <span className="_price">
                    {" " +
                      (item.price ?? item.basePrice!).toLocaleString("fa-IR") +
                      " " +
                      DEFAULT_CURRENCY}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        </li>
        <li className="_price" aria-label="Totla">
          <span> جمع کل</span>

          <span className="_price">
            {newTotalPrice.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>
        <li>
          <span aria-label="Shipment">هزینه ارسال</span>

          <span className="_price">
            {store.baseShipmentPrice.toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>
        <li>
          <span aria-label="Packaging">هزینه بسته بندی</span>

          <span className="_price">
            {store.packagingPrice.toLocaleString("fa-IR") +
              " " +
              DEFAULT_CURRENCY}
          </span>
        </li>
        <li className="_discount">
          <span aria-label="Discount">تخفیف</span>

          <span className="_price">
            {totalDiscount.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>
        <li className="_total">
          <span aria-label="final">نهایی</span>

          <span className="_price">
            {finalPrice.toLocaleString("fa-IR") + " " + DEFAULT_CURRENCY}
          </span>
        </li>
        {newTotalPrice < store.minOrderPrice ? (
          <li className="_total">
            <span aria-label="final">باقی مانده</span>

            <span className="_price">
              {(store.minOrderPrice - newTotalPrice).toLocaleString("fa-IR") +
                " " +
                DEFAULT_CURRENCY}
            </span>
          </li>
        ) : null}

        {order ? <OrderStatus order={order}></OrderStatus> : null}

        {order &&
        !order.isBilled &&
        !order.isCanceled &&
        store.isVerified &&
        store.isAvailible &&
        address &&
        store.cityName === address.cityName &&
        billSection &&
        newTotalPrice > store.minOrderPrice &&
        getStoreCurrentSchedule(schedule) ? (
          <li className="_order-button">
            <Link to={routes.checkout(order.id)}>
              <Button variant="accent" type="button" aria-label="Order">
                ثبت سفارش
              </Button>
            </Link>
          </li>
        ) : null}
      </ul>
    </Link>
  )
}
