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
  createOrder,
  FullOrderItem,
  updateOrder,

} from "~/utils/order.query.server"

import {
  getOrderInCart,
  getCart,
} from "~/utils/cart.query.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
} from "~/utils/store.query.server"
import {
  Order,
  User,
  Store,
} from "@prisma/client"
import { getUserByPhone } from "~/utils/user.query.server"
import { useEffect, useState } from "react"
import { Disabled } from "~/components/button.stories"

export const action = async ({ request, params }: any) => {
  try {
    const storeId = Number(params.storeId)

    if (!storeId || isNaN(storeId)) {
      throw new Error("404")
    }
console.log("1");

    const form = await request.formData()

    const phoneNumber = await requirePhoneNumber(request)
    const job: string | undefined = form.get("job")
    const addressId: number | undefined = Number(form.get("address"))
    const itemId: number | undefined = Number(form.get("id"))
    // const orderId: string | undefined = form.get("order")

    let orderInCart = await getOrderInCart({ phoneNumber, storeId })
    console.log("2")



    if (!orderInCart && addressId) {
      orderInCart = await createOrder({
        addressId,
        storeId,isInCart : true, isCanceled :false,isDelivered:false,
        userPhoneNumber: phoneNumber,
        estimatedDeliveryTime: 0,
        totalPrice: 0,
        taxPercent: 0,
        packagingPrice: 0,
        shipmentPrice: 0,
      })
      console.log(orderInCart)
      console.log("in cartttt")
      // await updateOrder({id : orderInCart.id, isBilled : false})
    }


    if (!orderInCart) {
      throw new Error("gozz")
    }

    if (job === "add") {
      await changeOrderItems({
        count: 1,
        state: "add",
        itemId: Number(itemId),
        orderId: orderInCart?.id,
      })
    }

    if (job === "remove") {
      await changeOrderItems({
        count: 1,
        state: "remove",
        itemId: Number(itemId),
        orderId: orderInCart?.id,
      })
    }
console.log("4")

    const newItems = await getFullStoreOrdersItems({ orderId: orderInCart.id, storeId })
    const newTotalPrice = await calculateOrder({ orderId: orderInCart.id })
    return { newItems, newTotalPrice }
  } catch (error) {
    throw error
  }
}

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
      totalPrice = (await calculateOrder({ orderId: order.id }))
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

  const [itemsState, setItemsState] = useState<FullOrderItem[]>(items)

  const [chosenItems, setChosenItems] = useState<(number | undefined)[]>(
    items.map((item: FullOrderItem) => (item.orderId ? item.id : undefined)),
  )

  const [orderState, setOrderState] = useState<Order>(order)
  const [address, setAddress] = useState<number>(0)

  const [totalPriceState, setTotalPriceState] = useState<number>(totalPrice)

  const actionData = useActionData()

  useEffect(() => {
    console.log(chosenItems)
    const x = localStorage.getItem("addressId")
    setAddress(Number(x))
  })

  useEffect(() => {
    if (
      actionData && actionData.totalPrice &&
      totalPriceState != actionData.newTotalPrice
    )
      setTotalPriceState(actionData.newTotalPrice)
  }, [actionData])

  useEffect(() => {
    if (actionData &&
      actionData.newItems &&
      actionData.newlItems != itemsState
    )
      setItemsState(actionData.newItems)
  }, [actionData])

  return (
    <>
      {order ? <p>{totalPrice}</p> : undefined}
      {itemsState.map((item: FullOrderItem, index: number) => (
        <div key={index}>
          <p>{item.name}</p>
          <Form method="post">
            {item.count}
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="job" value="add" />
            <input type="hidden" name="address" value={address} />
            <button type="submit">+</button>
          </Form>

          <Form method="post">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="job" value="remove" />
            {!item.count ? undefined : <button type="submit"> - </button>}
          </Form>
        </div>
      ))}

      <p>Items</p>
      {order && totalPriceState > store.minOrderPrice ? (
        <Link to={`../bill/${order.id}`}>Bill</Link>
      ) : undefined}
      {/* {itemsInStore.map((item, index) => )} */}
    </>
  )
}
