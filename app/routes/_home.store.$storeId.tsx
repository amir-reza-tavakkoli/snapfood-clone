import { LoaderArgs, LoaderFunction } from "@remix-run/node"
import { StoreInfo } from "~/components/store-info"
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react"
import { requirePhoneNumber } from "~/utils/session.server"
import {
  calculateOrder,
  changeOrderItems,
  createOrder,
  FullOrderItem,
} from "~/utils/order.query.server"

import { getStoreOrderInCart } from "~/utils/cart.query.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
} from "~/utils/store.query.server"
import type { Order, Store, User } from "@prisma/client"
import { getUserByPhone } from "~/utils/user.query.server"
import { useEffect, useState } from "react"
import { getAddressById } from "~/utils/address.query.server"
import { FoodCard } from "~/components/food-card"
import { LinksFunction } from "@remix-run/server-runtime"

import foodCardCss from "./../components/styles/food-card.css"
import storeInfoCss from "./../components/styles/store-info.css"
import storePageCss from "./styles/storeId-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeInfoCss },
  { rel: "stylesheet", href: foodCardCss },
  { rel: "stylesheet", href: storePageCss },
]

export const action = async ({ request, params }: any) => {
  try {
    const storeId = Number(params.storeId)

    if (!storeId || isNaN(storeId)) {
      throw new Error("404")
    }

    const form = await request.formData()

    const phoneNumber = await requirePhoneNumber(request)
    const job: string | undefined = form.get("job")
    const addressId: number | undefined = Number(form.get("address"))
    const itemId: number | undefined = Number(form.get("id"))

    const address = await getAddressById({ addressId })
    console.log(form.get("address"))

    if (!address || address.userPhoneNumber != phoneNumber) {
      throw new Error("Wrong Address")
    }

    let orderInCart = await getStoreOrderInCart({ phoneNumber, storeId })
    // console.log("2")

    if (!orderInCart && addressId) {
      orderInCart = await createOrder({
        addressId,
        storeId,
        isInCart: true,
        isCanceled: false,
        isDelivered: false,
        userPhoneNumber: phoneNumber,
        estimatedDeliveryTime: 0,
        totalPrice: 0,
        taxPercent: 0,
        packagingPrice: 0,
        shipmentPrice: 0,
      })
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

    const newItems = await getFullStoreOrdersItems({
      orderId: orderInCart.id,
      storeId,
    })
    const newTotalPrice = await calculateOrder({ orderId: orderInCart.id })

    const categorizedItems = new Map<string, FullOrderItem[]>()

    newItems.forEach(item => {
      if (categorizedItems.has(item.itemCategoryName)) {
        categorizedItems.get(item.itemCategoryName)?.push(item)
        return
      }

      categorizedItems.set(item.itemCategoryName, [])
      categorizedItems.get(item.itemCategoryName)?.push(item)
    })

    // console.log(categorizedItems.values())

    const array = Array.from(categorizedItems, ([name, value]) => ({
      name,
      value,
    }))

    return { array, newTotalPrice }
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
  array: {
    name: string
    value: FullOrderItem[]
  }[]
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
    let order = await getStoreOrderInCart({
      phoneNumber: phoneNumber,
      storeId,
    })

    let totalPrice: number = 0
    // let orderInfo: (StoreHasItems | undefined)[] = []
    // if (order) orderInfo = await getFullOrderItems({ orderId: order?.id })
    let items: FullOrderItem[]
    if (order) totalPrice = order.totalPrice

    if (!totalPrice && order) {
      totalPrice = await calculateOrder({ orderId: order.id })
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

    const categorizedItems = new Map<string, FullOrderItem[]>()

    items.forEach(item => {
      if (categorizedItems.has(item.itemCategoryName)) {
        categorizedItems.get(item.itemCategoryName)?.push(item)
        return
      }

      categorizedItems.set(item.itemCategoryName, [])
      categorizedItems.get(item.itemCategoryName)?.push(item)
    })

    // console.log(categorizedItems.values())

    const array = Array.from(categorizedItems, ([name, value]) => ({
      name,
      value,
    }))
    return { user, store, items, order, totalPrice, array }
  } catch (error) {
    throw error
  }
}

export default function StoreId() {
  const { user, store, items, order, totalPrice, array } =
    useLoaderData<typeof loader>()

  const navigate = useNavigate()

  const [itemsState, setItemsState] = useState<
    {
      name: string
      value: FullOrderItem[]
    }[]
  >(array)

  // const [chosenItems, setChosenItems] = useState<(number | undefined)[]>(
  //   items.map((item: FullOrderItem) => (item.orderId ? item.id : undefined)),
  // )

  const [orderState, setOrderState] = useState<Order>(order)
  const [address, setAddress] = useState<number>(0)
  //choosed city DANGER incompliance of addressId and city
  const [totalPriceState, setTotalPriceState] = useState<number>(totalPrice)

  const [render, reRender] = useState({})
  const actionData = useActionData()
  console.log(actionData === itemsState)

  useEffect(() => {
    const choosedAddress = localStorage.getItem("addressId")
    // console.log("kkkk", choosedAddress, "iiii")
    if (
      !choosedAddress ||
      isNaN(Number(choosedAddress)) ||
      !Number(choosedAddress)
    ) {
      setTimeout(() => navigate(`/home/addresses?storeId=${store.id}`), 2000)
      setAddress(-1)
    }

    if (Number(choosedAddress) != address) setAddress(Number(choosedAddress))
  }, [render])

  useEffect(() => {
    if (
      actionData &&
      actionData.totalPrice &&
      totalPriceState != actionData.newTotalPrice
    )
      setTotalPriceState(actionData.newTotalPrice)
  }, [actionData])

  useEffect(() => {
    if (actionData && actionData.array && actionData.array != itemsState)
      setItemsState(actionData.array)
  }, [actionData])

  return (
    <>
      {address <= -45 ? (
        <Link to={"home/addresses"}>Set An Address</Link>
      ) : (
        <main className="_store-page-container">
          <StoreInfo
            name={store.name}
            logo={store.avatarUrl}
            type={store.storeKindName}
          ></StoreInfo>
          <div className="_store-page-items-container">
            {itemsState.map(category => (
              <div className="_category-container">
                <p id={"__" + category.name}>{category.name}</p>
                <div>
                  {category.value.map((item: FullOrderItem, index: number) => (
                    <FoodCard
                      reRender={reRender}
                      address={address ?? -1}
                      count={item.count ?? 0}
                      id={item.id ?? 0}
                      remainingCount={item.remainingCount ?? 0}
                      name={item.name ?? ""}
                      image={item.avatarUrl ?? ""}
                      ingredients={item.description ?? ""}
                      type={item.itemCategoryName}
                      available={item.isAvailible ?? false}
                      prices={[
                        {
                          available: !!item.remainingCount ?? false,
                          vaule: item.price ?? item.basePrice ?? 0,
                          currency: "تومان",
                        },
                      ]}
                    ></FoodCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <aside className="_order_datails_container">
            <p>Items</p>
            {order ? <p>{totalPrice}</p> : undefined}

            {order && totalPriceState > store.minOrderPrice ? (
              <Link to={`../bill/${order.id}`}>Bill</Link>
            ) : undefined}
          </aside>
        </main>
      )}
    </>
  )
}
