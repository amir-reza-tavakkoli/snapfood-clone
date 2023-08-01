import type { LoaderArgs } from "@remix-run/server-runtime"

import { searchItem, searchStore } from "../queries.server/search.server"

import type { SearchType } from "../constants"

export const loader = async ({ request }: LoaderArgs): Promise<SearchType> => {
  const search = new URL(request.url).searchParams.get("search")

  const count = new URL(request.url).searchParams.get("count")

  const defaultTake = 4
  const takeThisMuch =
    count && Number(count) && !isNaN(Number(count))
      ? Number(count)
      : defaultTake

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
