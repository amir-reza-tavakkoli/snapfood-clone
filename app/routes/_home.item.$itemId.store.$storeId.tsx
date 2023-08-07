import { useEffect, useState } from "react"
import { useActionData, useLoaderData, V2_MetaFunction } from "@remix-run/react"

import {
  json,
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Order, Store, User, Comment } from "@prisma/client"

import { getStoreOrderInCart } from "../queries.server/cart.query.server"
import { getItemById } from "../queries.server/item.query.server"
import { getVerifiedItemComments } from "../queries.server/comment.query"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
} from "../queries.server/store.query.server"

import { ItemComp } from "../components/item"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { requireValidatedUser } from "../utils/validate.server"

import { useCheckAddress } from "../hooks/checkAddress"

import { CLIENT_CACHE_DURATION, JoinedOrderItem } from "../constants"

import itemCss from "./../components/styles/item.css"
import pageCss from "./styles/item-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: itemCss },
  { rel: "stylesheet", href: pageCss },
]

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
  foundItem: JoinedOrderItem
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
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    const itemId = Number(params.itemId)

    const storeId = Number(params.storeId)

    if (!itemId || !storeId) {
      throw new Response("چنین آیتمی وجود ندارد")
    }

    const item = await getItemById({ itemId })

    if (!item) {
      throw new Response("چنین آیتمی وجود ندارد")
    }

    const store = await getStore({ storeId })

    if (!store) {
      throw new Response("فروشگاهی با این مشخصات وجود ندارد")
    }

    let items: JoinedOrderItem[] = []

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
      throw new Response("چنین آیتمی وجود ندارد")
    }

    const foundItem = items.find(item => item.id === itemId)

    if (!foundItem || !foundItem.id) {
      throw new Response("آیتمی وجود ندارد")
    }

    const comments = await getVerifiedItemComments({
      itemId: foundItem.id,
      storeId,
    })
    
    return json({ foundItem, store, order, comments },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
      },
    })
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
      const newItem: JoinedOrderItem = actionData.newItems.find(
        (item: JoinedOrderItem) => item.id === foundItem.id,
      )

      if (actionData && newItem) setItem(newItem)
    }
  }, [actionData])

  const { addressState: address } = useCheckAddress()

  return (
    <main className="item-container">
      <h1 className="nonvisual">{foundItem.name}</h1>

      <ItemComp address={address} item={item} store={store}></ItemComp>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
