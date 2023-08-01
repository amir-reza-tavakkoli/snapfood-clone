import type { Order } from "@prisma/client"

import { getDiffInMinutes, getFormattedDate } from "~/utils/utils"

import { getOrderStatus } from "../queries.server/db.utils.query"

import { Timer } from "./timer"

import { MAX_ORDER_DELAY } from "~/constants"

type ComponentProps = { order: Order }

export function OrderStatus({ order }: ComponentProps) {
  const status = getOrderStatus({ order }).status

  const now = new Date(Date.now())

  const orderTime = new Date(
    order.billDate?.toString() ?? order.updatedAt.toString(),
  )

  orderTime.setMinutes(
    new Date(
      order.billDate?.toString() ?? order.updatedAt.toString(),
    ).getMinutes() +
      order.estimatedReadyTime +
      order.estimatedShipmentTime,
  )

  const nowPlusDelay = new Date(
    now.setMinutes(now.getMinutes() + MAX_ORDER_DELAY),
  )

  return (
    <div className="order-status">
      {status === "canceled" ? (
        <p className="_error">کنسل شده</p>
      ) : status === "fullfilled" ? (
        <p className="_success">دریافت شده و با موفقیت پایان یافته</p>
      ) : status === "storeNotVerified" || status === "adminNotVerified" ? (
        <p className="_error">تایید نشده و کنسل شده</p>
      ) : status === "inCart" ? (
        <p className="_success">در سبد قرار داده شده</p>
      ) : status === "shipped" ? (
        <p className="_error">
          ارسال شده
          <Timer
            initialMinute={getDiffInMinutes(orderTime, now) - 1}
            initialSeconds={59}
          ></Timer>
        </p>
      ) : status === "taken" ? (
        <p className="_success">ثبت شده و در انتظار تایید است</p>
      ) : status === "inProgress" ? (
        <>
          <p className="_success">با موفقیت ثبت شده</p>

          {nowPlusDelay < orderTime ? (
            <p>باید تا {getFormattedDate(orderTime)}برسد</p>
          ) : null}

          {now < orderTime ? (
            <Timer
              initialMinute={getDiffInMinutes(orderTime, now) - 1}
              initialSeconds={59}
            ></Timer>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
