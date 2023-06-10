import type { Item, Store, StoreHasItems } from "@prisma/client"
import { getOrderInCart } from "./cart.query.server"
import { db } from "./db.server"
import { FullOrderItem, getOrder, getOrderItems } from "./order.query.server"

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
}): Promise<
  FullOrderItem[]
> {
  try {
    const itemsInStore = await db.storeHasItems.findMany({
      where: { storeId },
      orderBy: {
        itemId: "desc",
      },
    })

    const order = await getOrder({ orderId })
    console.log("hereee", order);
    
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
