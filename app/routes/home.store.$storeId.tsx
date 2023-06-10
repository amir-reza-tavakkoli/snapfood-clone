import { LoaderArgs, LoaderFunction } from "@remix-run/node"

import { db } from "~/utils/db.server"
import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useRouteLoaderData,
} from "@remix-run/react"
import { getUser, requirePhoneNumber } from "~/utils/session.server"
import {
  calculateOrder,
  changeOrderItems,
  FullOrderItem,
  getFullOrderItems,
  getOrder,
  getOrderItems,
  getOrders,
} from "~/utils/order.query.server"

import {
  getOrdersInCart,
  getOrderInCart,
  getCart,
} from "~/utils/cart.query.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
  getStoreItems,
} from "~/utils/store.query.server"
import {
  Item,
  Order,
  StoreHasItems,
  User,
  Store,
  OrderHasItems,
} from "@prisma/client"
import { getUserByPhone } from "~/utils/user.query.server"
import { useEffect, useState } from "react"

export const action = async ({ request, params }: any) => {
  const storeId = Number(params.storeId)

  if (!storeId || isNaN(storeId)) {
    throw new Error("404")
  }

  const form = await request.formData()
  const phoneNumber = await requirePhoneNumber(request)
  const job: string | undefined = form.get("job")
  const itemId: number | undefined = form.get("item")
  // const orderId: string | undefined = form.get("order")

  const ordersFromStore = await db.order.findMany({
    where: {
      storeId,
      userPhoneNumber: phoneNumber,
      isInCart: true,
    },
  })

  if (ordersFromStore.length > 1) {
    throw new Error("Bad Request")
  }

  const order = ordersFromStore[0]

  if (job === "add") {
    changeOrderItems({
      count: 1,
      state: "add",
      itemId: Number(itemId),
      orderId: Number(order),
    })
  }

  const cart = await getCart({ phoneNumber })

  // const orderInCart = cart.orderInfo.find(
  //   cartOrder => cartOrder.order.id === order.id,
  // )

  // return { orderInCart }
}

// export const loader: LoaderFunction = async ({
//   request,
//   params,
// }: LoaderArgs) => {
//   try {
//     // let storeInfo: {
//     //   user?: User | null
//     //   store?: Store | null
//     //   order?: Order | null
//     //   itemsInStore?: {
//     //     items: (Item | null)[]
//     //   } | null
//     //   itemsInOrder?: {
//     //     items: (Item | null)[]
//     //     itemsInOrder: OrderHasItems[]
//     //   } | null

//     //   merged?: (Item | null | undefined)[]
//     // } = {}
//     const user = await getUser(request)

//     const storeId = Number(params.storeId)

//     if (!storeId || isNaN(storeId)) {
//       throw new Error("404")
//     }

//     const store = await getStore({ storeId })

//     if (!store) {
//       throw new Error("No such store")
//     }

//     // storeInfo.store = store
//     const itemsInStore = await getStoreItems({ storeId })
//     // // let order : Order | undefined

//     // storeInfo.itemsInStore = itemsInStore

//     if (user) {
//       let order = await getOrderInCart({
//         storeId: store.id,
//         phoneNumber: user?.phoneNumber,
//       })

//       // storeInfo.order = order
//       if (order) {
//         const itemsInOrder = await getOrderItems({ orderId: order?.id })
//         // storeInfo.itemsInOrder = itemsInOrder
//       }
//     }

//     if (storeInfo.itemsInOrder) {
//       const merged = storeInfo.itemsInOrder.itemsInOrder.map(itemInOrder => {
//          const x =storeInfo.itemsInStore?.items.find(
//           itemInStore => itemInOrder.itemId == itemInStore?.id,
//         )
//         return { a : x , itemInOrder}
//       })
//       console.log("merged", merged)
//       // storeInfo.merged = merged
//     }
//     return { storeInfo }
//   } catch (error) {
//     throw error
//   }
// }

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs): Promise<{
  user: User
  store: Store
  items: FullOrderItem[]
  order: Order | undefined
  totalPrice: number
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    const storeId = Number(params.storeId)

    const store = await getStore({ storeId })

    if (
      !store ||
      !storeId ||
      isNaN(storeId) ||
      !phoneNumber ||
      !user ||
      user.isSuspended
    ) {
      throw new Error("404")
    }

    // const itemsInStore = await getStoreItems({ storeId })
    let order = await getOrderInCart({
      phoneNumber: phoneNumber,
      storeId,
    })

    let totalPrice: number = 0
    // let orderInfo: (StoreHasItems | undefined)[] = []
    // if (order) orderInfo = await getFullOrderItems({ orderId: order?.id })
    let items: FullOrderItem[]
    if (order) totalPrice = order.totalPrice

    if (!totalPrice && order) {
      totalPrice = (await calculateOrder({ orderId: order.id })).totalPrice
    }

    if (order && !order.isBilled) {
      items = await getFullStoreOrdersItems({
        storeId,
        orderId: order.id,
      })
    } else {
      items = await getFullStoreItems({ storeId })
      order = undefined
    }

    return { user, store, items, order, totalPrice }
  } catch (error) {
    throw error
  }
}

export default function Store() {
  const { user, store, items, order, totalPrice } =
    useLoaderData<typeof loader>()

  console.log(items)

  const [state, setstate] = useState<FullOrderItem[] | undefined>(items)
  const [chosenItems, setChosenItems] = useState<(number | undefined)[]>(
    items.map((item: FullOrderItem) => (item.orderId ? item.id : undefined)),
  )
  const [isOrder, setIsOrder] = useState<boolean>(!!order)

  // const actionData = useActionData()
  // const x = useRouteLoaderData("routes/store")
  useEffect(() => {
    console.log(chosenItems)
  })

  return (
    <>
      {isOrder ? <p>{totalPrice}</p> : undefined}
      {items.map((item: FullOrderItem, index: number) => (
        <div key={index}>
          <p>{item.name}</p>
          <Form method="post">
            {item.count}
            <button
              type="submit"
              onClick={() => {
                if (!item.id) return
                const isInOrder = chosenItems.includes(item.id)
                if (!isInOrder) {
                  const x = chosenItems.push(item.id)

                  setChosenItems(chosenItems => {
                    chosenItems.push(item.id)
                    return chosenItems
                  })
                }
              }}
            >

              +
            </button>
            {!item.count ? undefined : <button type="submit"> - </button>}
          </Form>
        </div>
      ))}

      <p>Items</p>
      {/* {itemsInStore.map((item, index) => )} */}
    </>
  )
}
