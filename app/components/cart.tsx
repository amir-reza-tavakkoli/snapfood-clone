import { Order, Store } from "@prisma/client"
import { Link } from "@remix-run/react"
// import Orders from "~/routes/_home.cart"
import { FullOrderItem } from "~/utils/order.query.server"
import { Icon } from "./icon"
import { DEFAULT_CURRENCY } from "./../constants"
import { StoreCardDefault } from "./store-info.stories"

function toPersianDay(day: number) {
  switch (day) {
    case 0:
      return "یکشنبه"

    case 1:
      return "دوشنبه"

    case 2:
      return "سه شنبه"

    case 3:
      return "چهارشنبه"

    case 4:
      return "پنج شنبه"

    case 5:
      return "جمعه"

    default:
      return "شنبه"
  }
}

export type CartCompProps = {
  orders:
    | {
        items: FullOrderItem[]
        order: Order
        store: Store
      }[]
    | undefined
}

export const CartComp = ({ orders }: CartCompProps) => {
  return (
    <aside className="cart">
      {orders ? (
        <ol>
          {orders.map((order, index) => (
            <Link to={`/store/${order.store.id}`} key={index}>
              <li className="_order">
                <div>
                  <img src={order.store.avatarUrl ?? undefined} alt="" />
                  <span>
                    {" "}
                    <p>{order.store.name}</p>
                    <time>
                      <Icon name="time" color="faded"></Icon>
                      {new Date(order.order.createdAt).toLocaleString("fa-IR")}
                      {"      " }
                      {toPersianDay(new Date(order.order.createdAt).getDay())}
                    </time>{" "}
                      
                  </span>
                  <p>
                    {order.order.totalPrice.toLocaleString("fa-IR") +
                      DEFAULT_CURRENCY}
                  </p>
                </div>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="_item">
                      <img src={item.avatarUrl ?? undefined} alt=""></img>{" "}
                      <span>{item.count}</span>
                    </li>
                  ))}
                </ul>
              </li>
            </Link>
          ))}
        </ol>
      ) : (
        <p>No Orders</p>
      )}
    </aside>
  )
}
