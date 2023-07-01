import { db } from "~/utils/db.server"

export async function searchStore(param: string) {
  const exacts = await db.store.findMany({ where: { name: { equals: param } } })

  const nears = await db.store.findMany({
    where: { name: { in: param } },
    orderBy: { score: "desc" },
    take: 4,
  })

  const result = [...nears, ...exacts]
  return result
}

export async function searchItem(param: string) {
  const exacts = await db.item.findMany({ where: { name: { equals: param } } })

  const nears = await db.item.findMany({ where: { name: { in: param } } })
  return nears
}
