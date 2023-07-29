import { db } from "../utils/db.server"
import { getStore } from "./store.query.server"

type SearchParams = { param: string; takeThisMuch?: number }

export async function searchStore({ param, takeThisMuch = 4 }: SearchParams) {
  const nears = await db.store.findMany({
    where: { name: { contains: param } },
    orderBy: { score: "desc" },
    take: takeThisMuch,
  })
  return nears
}

export async function searchItem({ param, takeThisMuch = 4 }: SearchParams) {
  const nears = await db.item.findMany({
    where: { name: { contains: param } },
    take: takeThisMuch,
  })

  const itemsAndStores = await Promise.all(
    nears.map(async item => {
      const itemsInStores = await db.storeHasItems.findMany({
        where: { itemId: item.id },
      })

      let stores = await Promise.all(
        itemsInStores.map(
          async itemInStore => await getStore({ storeId: itemInStore.storeId }),
        ),
      )

      stores.filter(store => store)

      return { item, stores }
    }),
  )
  return itemsAndStores
}
