import { useEffect, useState } from "react"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { useActionData, useLoaderData } from "@remix-run/react"

import { Form } from "@remix-run/react"

import { db } from "~/utils/db.server"
import {
  changeOrderItems,
  getCartItems,
  getUserByPhone,
} from "~/utils/query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { Item, Order, OrderHasItems, Store } from "@prisma/client"

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

export const action = async ({ request }: any) => {
  const form = await request.formData()
  const phoneNumber = await requirePhoneNumber(request)
  const job: string | undefined = form.get("job")
  const itemId: number | undefined = form.get("item")
  const orderId: string | undefined = form.get("order")

  if (job === "add") {
    changeOrderItems({
      count: 2,
      itemId: Number(itemId),
      orderId: Number(orderId),
    })
  }

  // const cart = await getCart(phoneNumber)
  // console.log(cart);

  return null
}

async function getCart(phoneNumber: string) {
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

export const loader = async ({ request }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  return await getCart(phoneNumber)
}

type OrderInfo = {
  order: Order
  item: OrderHasItems[]
  store: Store | null
  itemdetails: (Item | null)[]
}[]

export default function Index() {
  const data = useLoaderData<typeof loader>()
  // const actionData = useActionData()

  const [state, setstate] = useState<OrderInfo>(data.orderInfo)

  useEffect(() => {
    if (data.orderInfo) setstate(data.orderInfo)
  }, [data.orderInfo])

  console.log("state :", state)

  return (
    <div>
      <h1>Welcome to Remix</h1>
      <Form action="/?index" method="post">
        <input type="hidden" name="order" value={1} />
        <input type="hidden" name="item" value={1} />
        <input type="hidden" name="job" value={"add"} />

        <button type="submit">add</button>
        {/* <p>{data.orderInfo }</p> */}
      </Form>
    </div>
  )
}
