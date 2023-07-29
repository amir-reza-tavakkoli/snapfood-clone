import { useEffect, useState } from "react"

import { LoaderArgs, LoaderFunction, V2_MetaFunction } from "@remix-run/node"

import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,

} from "@remix-run/react"

import { LinksFunction } from "@remix-run/server-runtime"

import { requirePhoneNumber } from "../utils/session.server"

import {
  calculateOrder,
  changeOrderItems,
  ChangeOrderItemState,
  createOrder,
  FullOrderItem,
  getFullOrderItems,
} from "../queries.server/order.query.server"
import { getStoreOrderInCart } from "../queries.server/cart.query.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
  getStoreSchedule,
} from "../queries.server/store.query.server"
import { categorizeItems } from "../queries.server/db.utils.query"
import { getAddressById } from "../queries.server/address.query.server"

import type { Order, Store, storeSchedule, User } from "@prisma/client"

import { StoreInfo } from "../components/store-info"
import { FoodCard } from "../components/food-card"
import { OrderComp } from "../components/order"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { COOKIE_ADDRESS,  DEFAULT_CURRENCY } from "../constants"

import { routes } from "../routes"
import { getStoreCurrentSchedule } from "../utils/utils"
import { requireValidatedUser } from "../utils/validate.server"

import foodCardCss from "./../components/styles/food-card.css"
import storeInfoCss from "./../components/styles/store-info.css"
import orderCss from "./../components/styles/order.css"
import pageCss from "./styles/store-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeInfoCss },
  { rel: "stylesheet", href: foodCardCss },
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Store ${data.store.name ?? ""}`,
        title: `SnappFood Clone Store ${data.store.name ?? ""}`,
      }
    : { description: "No Store found", title: "No Store" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type ActionType = {
  categorizedItems: {
    name: string
    value: FullOrderItem[]
  }[]
  newItems: FullOrderItem[]
  newTotalPrice: number
  orderItems: FullOrderItem[]
  orderInCart: Order
}

export const action = async ({ request, params }: any): Promise<ActionType> => {
  try {
    const storeId = Number(params.storeId)

    if (!storeId || isNaN(storeId)) {
      throw new Error("خطا")
    }

    const form = await request.formData()

    const phoneNumber = await requirePhoneNumber(request)
    const job: ChangeOrderItemState | undefined = form.get("job")
    const addressId: number | undefined = Number(form.get("address"))
    const itemId: number | undefined = Number(form.get("id"))

    const address = await getAddressById({ addressId })

    if (!address || address.userPhoneNumber != phoneNumber) {
      throw new Error("آدرس اشتباه است")
    }

    let orderInCart = await getStoreOrderInCart({ phoneNumber, storeId })

    if (!orderInCart && addressId) {
      orderInCart = await createOrder({
        addressId,
        estimatedReadyTime: 0,
        estimatedShipmentTime: 0,
        storeId,
        isInCart: true,
        isCanceled: false,
        isDelivered: false,
        userPhoneNumber: phoneNumber,
        totalPrice: 0,
        shipmentPrice: 0,
      })
    }

    if (!orderInCart) {
      throw new Error("خطا")
    }

    if (job !== "add" && job !== "remove" && job !== "set") {
      throw new Error("خطا")
    }

    await changeOrderItems({
      count: 1,
      state: job,
      itemId: Number(itemId),
      orderId: orderInCart?.id,
    })

    const newItems = await getFullStoreOrdersItems({
      orderId: orderInCart.id,
      storeId,
    })

    const newTotalPrice = await calculateOrder({ orderId: orderInCart.id })

    const categorizedItems = categorizeItems({ items: newItems })

    const orderItems = await getFullOrderItems({ orderId: orderInCart.id })

    return {
      categorizedItems,
      newTotalPrice,
      newItems,
      orderItems,
      orderInCart,
    }
  } catch (error) {
    throw error
  }
}

type LoaderType = {
  user: User
  store: Store
  items: FullOrderItem[]
  order: Order | undefined
  totalPrice: number
  categorizedItems: {
    name: string
    value: FullOrderItem[]
  }[]
  orderItems: FullOrderItem[] | undefined
  schedule: storeSchedule[]
}

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const storeId = Number(params.storeId)

    const store = await getStore({ storeId })

    if (
      !store ||
      !storeId ||
      isNaN(storeId) ||
      !user.phoneNumber ||
      !user ||
      user.isSuspended
    ) {
      throw new Error("خطا")
    }

    let order = await getStoreOrderInCart({
      phoneNumber: user.phoneNumber,
      storeId,
    })

    let totalPrice: number = 0

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

    const orderItems = order
      ? await getFullOrderItems({ orderId: order.id })
      : undefined

    const categorizedItems = categorizeItems({ items })

    const schedule = await getStoreSchedule({ store })
    return {
      user,
      schedule,
      store,
      items,
      order,
      totalPrice,
      categorizedItems,
      orderItems,
    }
  } catch (error) {
    throw error
  }
}

export default function StorePage() {
  const {
    user,
    schedule,
    store,
    order,
    totalPrice,
    categorizedItems,
    orderItems,
  } = useLoaderData<typeof loader>() as unknown as LoaderType

  const navigate = useNavigate()

  const [itemsState, setItemsState] = useState<
    {
      name: string
      value: FullOrderItem[]
    }[]
  >(categorizedItems)

  const [orderState, setOrderState] = useState(order)
  const [address, setAddress] = useState<number>(0)
  const [orderItemsState, setorderItems] = useState(orderItems)

  const [totalPriceState, setTotalPriceState] = useState<number>(totalPrice)

  const [render, reRender] = useState({})
  const actionData = useActionData() as unknown as ActionType

  useEffect(() => {
    const choosedAddress = localStorage.getItem(COOKIE_ADDRESS)

    if (!choosedAddress || isNaN(Number(choosedAddress))) {
      setTimeout(() => navigate(`/addresses?storeId=${store.id}`), 2000)
      setAddress(-1)
    }

    if (Number(choosedAddress) != address) setAddress(Number(choosedAddress))
  }, [render])

  useEffect(() => {
    if (
      actionData &&
      actionData.newTotalPrice &&
      totalPriceState != actionData.newTotalPrice
    )
      setTotalPriceState(actionData.newTotalPrice)
  }, [actionData])

  useEffect(() => {
    if (
      actionData &&
      actionData.categorizedItems &&
      actionData.categorizedItems != itemsState
    )
      setItemsState(actionData.categorizedItems)
  }, [actionData])

  useEffect(() => {
    if (actionData && actionData.orderItems) {
      setorderItems(actionData.orderItems)
      setOrderState(actionData.orderInCart)
    }
  }, [actionData])

  const s = getStoreCurrentSchedule(schedule)
  return (
    <>
      {!address || address <= -1  ? (
        <Link to={routes.addresses}>یک آدرس جدید ایجاد کنید</Link>
      ) : (
        <main className={!!s ? "store-page" : "store-page store-colsed"}>
          <StoreInfo
            name={store.name}
            logo={store.avatarUrl ?? ""}
            type={store.storeKindName}
            categories={categorizedItems.map(category => category.name)}
            isOpen={!!s}
          ></StoreInfo>

          <div className="_store-page-items">
            {itemsState.map(category => (
              <div className="_category">
                <p id={"__" + category.name}>{category.name}</p>

                <div>
                  {category.value.map((item: FullOrderItem, index: number) => (
                    <FoodCard
                      store={store}
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
                          currency: DEFAULT_CURRENCY,
                          discountPercent: item.discountPercent,
                        },
                      ]}
                    ></FoodCard>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {orderItems && orderItemsState && order && orderState ? (
            <OrderComp
              items={orderItemsState}
              order={orderState}
              store={store}
              totalPrice={totalPriceState}
              billSection={true}
            ></OrderComp>
          ) : null}
        </main>
      )}
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
