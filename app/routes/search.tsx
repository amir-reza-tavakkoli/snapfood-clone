import { json, LoaderArgs, TypedResponse } from "@remix-run/server-runtime"

import { searchItem, searchStore } from "../queries.server/search.server"

import { CLIENT_CACHE_DURATION, SearchType } from "../constants"

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<SearchType | null>> => {
  const search = new URL(request.url).searchParams.get("search")

  const count = new URL(request.url).searchParams.get("count")

  const defaultTake = 4

  const takeThisMuch =
    count && Number(count) && !isNaN(Number(count))
      ? Number(count)
      : defaultTake

  if (!search || typeof search !== "string" || search === "") {
    return json(null)
  }

  const stores = await searchStore({
    param: search,
    takeThisMuch: takeThisMuch,
  })

  const itemsAndStores = await searchItem({
    param: search,
    takeThisMuch: takeThisMuch,
  })

  return json(
    { stores, itemsAndStores },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
      },
    },
  )
}
