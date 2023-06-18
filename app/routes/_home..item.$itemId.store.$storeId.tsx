import { useLoaderData } from "@remix-run/react"
import { json, LoaderArgs, LoaderFunction } from "@remix-run/server-runtime"
import { db } from "~/utils/db.server"
import { getItem } from "~/utils/item.query.server"
import {
  getFullStoreItems,
  getStore,
  getStoreItems,
} from "~/utils/store.query.server"

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  try {
    const itemId = Number(params.itemId)
    const storeId = Number(params.storeId)

    if (!itemId || !storeId) {
      throw new Error("404")
    }

    const item = await getItem({ itemId })

    if (!item) {
      throw new Error("No Such Item")
    }

    const items = await getFullStoreItems({ storeId })

    if (!items) {
      throw new Error("No Items There")
    }

    const foundItem = items.find(item => item.id == itemId)

    return foundItem
  } catch (error) {
    throw error
  }
}

export default function ItemInStore() {
  const item = useLoaderData<typeof loader>()

  return <p>{item.name + item.storeId}</p>
}
