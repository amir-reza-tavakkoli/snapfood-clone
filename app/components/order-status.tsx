import { Order } from "@prisma/client"
import { getOrderStatus } from "~/queries.server/db.utils.query"
import { Timer } from "./timer"

type ComponentProps = { order: Order }

export function OrderStatus({ order }: ComponentProps) {
  const status = getOrderStatus({ order }).status
  return (
    <div>
      {status === "canceled" ? (
        <p className="_error">کنسل شده</p>
      ) : status === "fullfilled" ? (
        <p className="_success">دریافت شده و با موفقیت پایان یافته</p>
      ) : status === "storeNotVerified" || status === "adminNotVerified" ? (
        <p className="_error">تایید نشده و کنسل شده</p>
      ) : status === "inCart" ? (
        <p className="_success">در سبد قرار داده شده</p>
      ) : status === "shipped" ? (
        <p className="_error">ارسال شده <Timer initialMinute={order.estimatedShipmentTime} initialSeconds={0}></Timer></p>
      ) : status === "taken" ? (
        <p className="_success">ثبت شده و در انتظار تایید است</p>
      ) : status === "inProgress" ? (
        <p className="_error">با موفقیت ثبت شده</p>
      ) : null}
    </div>
  )
}
