import { db } from "~/utils/db.server"
import { getStore } from "./store.query.server"

export async function searchStore({ param }: { param: string }) {
  const nears = await db.store.findMany({
    where: { name: { contains: param } },
    orderBy: { score: "desc" },
    take: 4,
  })
  return nears
}

export async function searchItem({ param }: { param: string }) {
  const nears = await db.item.findMany({ where: { name: { contains: param } } })

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
