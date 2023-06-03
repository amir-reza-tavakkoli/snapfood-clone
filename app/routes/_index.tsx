import { useState } from "react"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { db } from "~/utils/db.server"
import { getCartItems, getUserByPhone } from "~/utils/query.server"
import { requirePhoneNumber } from "~/utils/session.server"

//to be implemented

// const addToCart = async (orderId: number, itemId: number, count: number) => {
//   const order = await db.orderHasItems.findUnique({
//     where: {
//       itemId_orderId: {
//         orderId: orderId,
//         itemId: itemId,
//       },
//     },
//   })

//   if (order?.count == count) {
//     return true
//   }

//   if (order && order.count != count) {
//     await db.orderHasItems.update({
//       where: {
//         itemId_orderId: {
//           orderId: orderId,
//           itemId: itemId,
//         },
//       },
//       data: {
//         count: count,
//       },
//     })
//   }

//   const itemInStore = await db.orderHasItems.create({
//     data: {
//       orderId,
//       itemId,
//       count,
//     },
//   })

// }

export const loader = async ({ request }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    const ordersInCart = await getCartItems({ phoneNumber })

    const cart = await Promise.all(
      ordersInCart.map(order =>
        db.orderHasItems.findMany({
          where: {
            orderId: order.id,
          },
        }),
      ),
    )

    const items = await Promise.all(
      cart.map(
        async order =>
          await Promise.all(
            order.map(item =>
              db.item.findUnique({
                where: {
                  id: item.itemId,
                },
              }),
            ),
          ),
      ),
    )

    const stores = await Promise.all(
      ordersInCart.map(order =>
        db.store.findUnique({
          where: {
            id: order.storeId,
          },
        }),
      ),
    )

    let orderInfo = ordersInCart.map((item, index) => {
      return {
        order: item,
        item: cart[index],
        store: stores[index],
        itemdetails: items[index],
      }
    })

    return { orderInfo }
  } catch (error) {
    throw error
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  // const [state, setstate] = useState(data.orderInfo ?? [[]])

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
