import { Order, Store, User, Comment } from "@prisma/client"
import { useActionData, useLoaderData, V2_MetaFunction } from "@remix-run/react"
import { LoaderArgs, LoaderFunction } from "@remix-run/server-runtime"
import { useEffect, useState } from "react"

import { getStoreOrderInCart } from "../queries.server/cart.query.server"
import { getItemById } from "../queries.server/item.query.server"
import { FullOrderItem } from "../queries.server/order.query.server"
import { requirePhoneNumber } from "../utils/session.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
} from "../queries.server/store.query.server"
import { getUserByPhone } from "../queries.server/user.query.server"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { getVerifiedItemComments } from "../queries.server/comment.query"
import { useCheckAddress } from "../hooks/forceAddress"
import { ItemComp } from "../components/item"
import { requireValidatedUser } from "../utils/validate.server"

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Item ${data.foundItem.name ?? ""}`,
        title: `SnappFood Clone Item ${data.foundItem.name ?? ""}`,
      }
    : { description: "No Item found", title: "No Item" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = {
  foundItem: FullOrderItem
  store: Store
  order: Order | undefined
  comments: (
    | {
        user: User
        order: Order
        comment: Comment
      }
    | undefined
  )[]
}

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)
    const itemId = Number(params.itemId)
    const storeId = Number(params.storeId)

    if (!itemId || !storeId) {
      throw new Error("404")
    }

    const item = await getItemById({ itemId })

    if (!item) {
      throw new Error("چنین آیتمی وجود ندارد")
    }

    const store = await getStore({ storeId })

    if (!store) {
      throw new Error("فروشگاهی با این مشخصات وجود ندارد")
    }

    let items: FullOrderItem[] = []

    let order = await getStoreOrderInCart({
      storeId: store.id,
      phoneNumber: user.phoneNumber,
    })

    if (order && !order.isBilled) {
      items = await getFullStoreOrdersItems({
        storeId,
        orderId: order.id,
      })
    } else {
      items = await getFullStoreItems({ storeId })
      order = undefined
    }

    if (!items) {
      throw new Error("No Items There")
    }

    const foundItem = items.find(item => item.id === itemId)

    if (!foundItem || !foundItem.id) {
      throw new Error("No Items There")
    }

    const comments = await getVerifiedItemComments({
      itemId: foundItem.id,
      storeId,
    })
    return { foundItem, store, order, comments }
  } catch (error) {
    throw error
  }
}

export default function ItemPage() {
  const { foundItem, store, order, comments } = useLoaderData<typeof loader>()
  const actionData = useActionData()
  const [item, setItem] = useState(foundItem)

  useEffect(() => {
    if (actionData && actionData.newItems) {
      const newItem: FullOrderItem = actionData.newItems.find(
        (item: FullOrderItem) => item.id === foundItem.id,
      )

      if (actionData && newItem) setItem(newItem)
    }
  }, [actionData])

  const { addressState: address } = useCheckAddress()
  console.log("add", address)

  return (
    <main>
      <ItemComp address={address} item={item} store={store}></ItemComp>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
