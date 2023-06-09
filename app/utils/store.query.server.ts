import type {
  Address,
  Comment,
  Item,
  Order,
  Store,
  OrderHasItems,
  StoreHasItems,
} from "@prisma/client"
import { db } from "./db.server"

export async function getStore({
  storeId,
}: {
  storeId: number
}): Promise<Store | null> {
  try {
    const store = await db.store.findUnique({
      where: {
        id: storeId,
      },
    })

    return store
  } catch (error) {
    throw error
  }
}

export async function getStores(): Promise<Store[] | null> {
  try {
    const stores = await db.store.findMany({ orderBy: { id: "desc" } })

    return stores
  } catch (error) {
    throw error
  }
}

export async function getStoresByCity({
  cityName,
}: {
  cityName: string
}): Promise<Store[] | null> {
  try {
    const city = await db.city.findUnique({ where: { name: cityName } })

    if (!city) {
      throw new Error("Unsupported City")
    }

    const stores = await db.store.findMany({
      where: {
        cityName,
      },
      orderBy: { id: "desc" },
    })

    return stores
  } catch (error) {
    throw error
  }
}

export async function getStoreItems({
  storeId,
}: {
  storeId: number
}): Promise<{ items: (Item | null)[]; itemsInStore: StoreHasItems[] }> {
  try {
    const itemsInStore = await db.storeHasItems.findMany({
      where: { storeId },
      orderBy: {
        itemId: "desc",
      },
    })

    const items = await Promise.all(
      itemsInStore.map(itemInStore =>
        db.item.findUnique({
          where: {
            id: itemInStore.itemId,
          },
        }),
      ),
    )

    return { items, itemsInStore }
  } catch (error) {
    throw error
  }
}

export async function getFullStoreItems({
  storeId,
}: {
  storeId: number
}): Promise<
  {
    id: number
    storeId: number
    itemId: number
    createdAt: Date
    updatedAt: Date
    name: string
    description?: string | null
    price: number
    discountPercent: number | null
    remainingCount: number
    estimatedReadyTime: number
    isAvailible: boolean
    avatarUrl?: string | null
    basePrice?: number | null
    isVerified: boolean
    itemCategoryName?: string | undefined
  }[]
> {
  try {
    const itemsInStore = await db.storeHasItems.findMany({
      where: { storeId },
      orderBy: {
        itemId: "desc",
      },
    })

    const items = await Promise.all(
      itemsInStore.map(itemInStore =>
        db.item.findUnique({
          where: {
            id: itemInStore.itemId,
          },
        }),
      ),
    )

    const mergedWithItems = itemsInStore.map(itemInStore => {
      const found = items.find(item => item && item.id == itemInStore.itemId)

      if (!found) {
        throw new Error("Item Not Found")
      }

      return { ...found, ...itemInStore }
    })

    return mergedWithItems
  } catch (error) {
    throw error
  }
}
