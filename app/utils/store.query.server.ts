import type {
  City,
  Item,
  Store,
  StoreHasItems,
  StoreKind,
} from "@prisma/client"
import { db } from "./db.server"

import type { FullOrderItem } from "./order.query.server"
import { getOrder, getOrderItems } from "./order.query.server"

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

export async function getStores(): Promise<Store[]> {
  try {
    const stores = await db.store.findMany({ orderBy: { id: "desc" } })

    return stores
  } catch (error) {
    throw error
  }
}

export async function getStoresByCity({
  cityName,
  storeKindName,
}: {
  cityName: string
  storeKindName? : string
}): Promise<Store[] | null> {
  try {
    const city = await db.city.findUnique({ where: { name: cityName } })

    if (!city) {
      throw new Error("Unsupported City")
    }

    const stores = await db.store.findMany({
      where: {
        cityName,
        storeKindName
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
}): Promise<FullOrderItem[]> {
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

export async function getStoreCategories({
  storeId,
}: {
  storeId: number
}): Promise<string[]> {
  try {
    const store = await getStore({ storeId })

    if (!store) {
      throw new Error("No Such Store")
    }

    const { items } = await getStoreItems({ storeId })

    const storeCategories: string[] = []

    items.forEach(item =>
      item &&
      item.itemCategoryName &&
      !storeCategories.includes(item.itemCategoryName)
        ? storeCategories.push(item.itemCategoryName)
        : undefined,
    )

    return storeCategories
  } catch (error) {
    throw error
  }
}

export async function getFullStoreOrdersItems({
  storeId,
  orderId,
}: {
  storeId: number
  orderId: number
}): Promise<FullOrderItem[]> {
  try {
    const itemsInStore = await db.storeHasItems.findMany({
      where: { storeId },
      orderBy: {
        itemId: "desc",
      },
    })

    const order = await getOrder({ orderId })

    if (!order || !order.isInCart || order.isBilled) {
      throw new Error("Order Is Not In Cart")
    }

    const { itemsInOrder } = await getOrderItems({ orderId })

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

      const itemInOrder = itemsInOrder.find(
        item => item && item.itemId == itemInStore.itemId,
      )

      return { ...found, ...itemInStore, ...itemInOrder }
    })

    return mergedWithItems
  } catch (error) {
    throw error
  }
}

export async function getStoresKind(): Promise<StoreKind[]> {
  try {
    const kinds = await db.storeKind.findMany()

    return kinds
  } catch (error) {
    throw error
  }
}

export async function getItemCategories() {
  try {
    const categories = await db.itemCategory.findMany({take: 12})

    return categories
  } catch (error) {
    throw error
  }
}

export async function getStoresByKind({
  kind,
}: {
  kind: string
}): Promise<Store[]> {
  try {
    const stores = await db.store.findMany({
      where: {
        storeKindName: kind,
      },
    })

    return stores
  } catch (error) {
    throw error
  }
}

export async function getStoreItemCategories({ storeId }: { storeId: number }) {
  try {
    const items = (await getStoreItems({ storeId })).items

    const kinds: string[] = []

    items.map(item =>
      item && !kinds.includes(item.itemCategoryName)
        ? kinds.push(item.itemCategoryName)
        : undefined,
    )

    console.log(kinds)
    return kinds
  } catch (error) {
    throw error
  }
}

export async function getSupportedCities(): Promise<City[] | null> {
  try {
    const cities = await db.city.findMany()

    return cities
  } catch (error) {
    throw error
  }
}
