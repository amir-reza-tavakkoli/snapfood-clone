import { Item, Store } from "@prisma/client"

import { LoaderArgs } from "@remix-run/server-runtime"

import { searchItem, searchStore } from "~/queries.server/search.server"

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
  console.log(search)

  if (!search || typeof search !== "string" || search === "") {
    return null
  }

  const stores = await searchStore({
    param: search,
    // takeThisMuch: Number(count) ?? undefined,
  })

  const itemsAndStores = await searchItem({
    param: search,
    // takeThisMuch: Number(count) ?? undefined,
  })

  return { stores, itemsAndStores }
}

export { type LoaderType as SearchType }
