import { Order, User } from "@prisma/client"
import { Link, useLoaderData } from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { getFullOrdersStore, getOrders } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"

import ordersCss from "~/components/orders.css"
import type { FullOrderStore } from "~/utils/order.query.server"

import { Orders } from "~/components/orders"
import { DEAFULT_DIRECTION } from "./home"

import ordersSummaryCss from "./styles/orders-summary.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: ordersCss },
  { rel: "stylesheet", href: ordersSummaryCss },]

export const loader = async ({ request }: LoaderArgs): Promise<FullOrderStore[]> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    let orders = await getFullOrdersStore({ phoneNumber })
  // console.log("vvvv",orders)

    if (orders && orders.length > 0) {
      orders = orders.filter(
        order =>
          order &&
          order.isBilled &&
          order.isVerifiedByAdmin &&
          order.isVerifiedByStore,
      )
    }

    return orders
  } catch (error) {
    throw error
  }
}

export default function Ordersx() {
  const orders = useLoaderData<typeof loader>()

const uu = orders.map(order => {
  return {
    date: new Date(order.createdAt),
    name: order.name ?? "",
    logo: order.avatarUrl ?? "",
    // time: "12:39",
  }
})
  return (
    <article className="_orders-container">
      {orders ? (
        <Orders orders={uu} dir={DEAFULT_DIRECTION}></Orders>
      ) : (
        <p>No Orders Yet</p>
      )}
    </article>
  )
}
