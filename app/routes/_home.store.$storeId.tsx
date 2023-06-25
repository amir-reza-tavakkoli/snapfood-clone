import { useEffect, useState } from "react"

import { LoaderArgs, LoaderFunction } from "@remix-run/node"

import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "@remix-run/react"

import { LinksFunction } from "@remix-run/server-runtime"

import { requirePhoneNumber } from "~/utils/session.server"
import {
  calculateOrder,
  changeOrderItems,
  ChangeOrderItemState,
  createOrder,
  FullOrderItem,
  getFullOrderItems,
} from "~/utils/order.query.server"
import { getStoreOrderInCart } from "~/utils/cart.query.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
} from "~/utils/store.query.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { getAddressById } from "~/utils/address.query.server"

import type { Order, Store, User } from "@prisma/client"

import { StoreInfo } from "~/components/store-info"
import { FoodCard } from "~/components/food-card"

import { DEFAULT_CURRENCY } from "~/constants"

import foodCardCss from "./../components/styles/food-card.css"
import storeInfoCss from "./../components/styles/store-info.css"
import orderCss from "./../components/styles/order.css"
import pageCss from "./styles/store-page.css"
import { categorizeItems } from "~/utils/utils.server"
import { OrderComp } from "~/components/order"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: storeInfoCss },
  { rel: "stylesheet", href: foodCardCss },
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: pageCss },
]

export const action = async ({
  request,
  params,
}: any): Promise<{
  categorizedItems: {
    name: string
    value: FullOrderItem[]
  }[]
  newItems: FullOrderItem[]
  newTotalPrice: number
  orderItems: (FullOrderItem | undefined)[]
  orderInCart: Order
}> => {
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

export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs): Promise<{
  user: User
  store: Store
  items: FullOrderItem[]
  order: Order | undefined
  totalPrice: number
  categorizedItems: {
    name: string
    value: FullOrderItem[]
  }[]
  orderItems: (FullOrderItem | undefined)[] | undefined
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
      throw new Error("خطا")
    }

    let order = await getStoreOrderInCart({
      phoneNumber: phoneNumber,
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

    return {
      user,
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

export default function StoreId() {
  const { user, store, order, totalPrice, categorizedItems, orderItems } =
    useLoaderData<typeof loader>() as {
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
    }

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
  const actionData = useActionData()
  console.log(address)

  useEffect(() => {
    const choosedAddress = localStorage.getItem("addressId")

    if (
      !choosedAddress ||
      isNaN(Number(choosedAddress)) ||
      !Number(choosedAddress)
    ) {
      setTimeout(() => navigate(`/addresses?storeId=${store.id}`), 2000)
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

  return (
    <>
      {address <= -1 ? (
        <Link to={"/addresses"}>یک آدرس جدید ایجاد کنید</Link>
      ) : (
        <main className="_store-page">
          <StoreInfo
            name={store.name}
            logo={store.avatarUrl ?? ""}
            type={store.storeKindName}
            categories={categorizedItems.map(category => category.name)}
          ></StoreInfo>

          <div className="_store-page-items">
            {itemsState.map(category => (
              <div className="_category">
                <p id={"__" + category.name}>{category.name}</p>

                <div>
                  {category.value.map((item: FullOrderItem, index: number) => (
                    <FoodCard
                      storeId={store.id}
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
                        },
                      ]}
                    ></FoodCard>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* <article className="_order_datails_container">
            <p>دریافت در سریعترین زمان</p>
            <p>
              {store.shipmentPrice.toLocaleString("fa-IR") + DEFAULT_CURRENCY}{" "}
              پیک فروشنده
            </p>

            {order ? (
              <p>
                مجموع اقلام :
                {totalPrice.toLocaleString("fa-IR") + DEFAULT_CURRENCY}
              </p>
            ) : undefined}

            {order ? (
              <p>
                حداقل سبد خرید :
                {store.minOrderPrice.toLocaleString("fa-IR") + DEFAULT_CURRENCY}
              </p>
            ) : undefined}

            <p>آیتم های انتخاب شده</p>
            {orderItems ? (
              <ul className="_order-items">
                {orderItems.map((item, index) => (
                  <li key={index} className="_item">
                    <span>{item?.name}</span>

                    <span>{item?.price}</span>

                    <span aria-label="Count">{item?.count}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {order && store.minOrderPrice - totalPrice > 0 ? (
              <p>
                باقی مانده :
                {store.minOrderPrice - totalPrice + DEFAULT_CURRENCY}
              </p>
            ) : undefined}

            {order &&
            user.isVerified &&
            !user.isSuspended &&
            store.isVerified &&
            store.isAvailible &&
            totalPriceState > store.minOrderPrice ? (
              <Link to={`/bill/${order.id}`}>ثبت سفارش</Link>
            ) : undefined}
          </article> */}
          {orderItems && orderItemsState && order && orderState ? (
            <OrderComp
              items={orderItemsState}
              order={orderState}
                store={store}
                totalPrice={totalPriceState}
            ></OrderComp>
          ) : null}
        </main>
      )}
    </>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  const errorMessage = error instanceof Error ? error.message : undefined
  return (
    <div
      aria-label="error"
      role="alert"
      aria-live="assertive"
      className="boundary-error"
    >
      <h1>مشکلی پیش آمد!</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}
    </div>
  )
}
