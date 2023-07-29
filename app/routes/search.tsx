import { Item, Store } from "@prisma/client"

import { LoaderArgs } from "@remix-run/server-runtime"

import { searchItem, searchStore } from "../queries.server/search.server"

type LoaderType = {
  stores: Store[]
  itemsAndStores: {
    item: Item
    stores: (Store | null)[]
  }[]
} | null

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
  const search = new URL(request.url).searchParams.get("search")
  const count = new URL(request.url).searchParams.get("count")

  const defaultTake = 4
  const takeThisMuch =
    count && Number(count) && !isNaN(Number(count))
      ? Number(count)
      : defaultTake

  console.log(search)

  if (!search || typeof search !== "string" || search === "") {
    return null
  }

  const stores = await searchStore({
    param: search,
    takeThisMuch: takeThisMuch,
  })

  const itemsAndStores = await searchItem({
    param: search,
    takeThisMuch: takeThisMuch,
  })

  return { stores, itemsAndStores }
}

export { type LoaderType as SearchType }
