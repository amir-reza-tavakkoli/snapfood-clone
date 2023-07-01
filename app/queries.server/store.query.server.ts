import type {
  Item,
  ItemCategory,
  Store,
  StoreHasItems,
  StoreKind,
} from "@prisma/client"

import { db } from "../utils/db.server"

import type { FullOrderItem } from "./order.query.server"

import { getOrder, getOrderItems } from "./order.query.server"

import { validateStore } from "../utils/validate.server"
import { validateCity } from "../utils/validate.server"

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
  storeKindName?: string
}): Promise<Store[] | null> {
  try {
    await validateCity({ cityName })

    const stores = await db.store.findMany({
      where: {
        cityName,
        storeKindName,
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
        throw new Error("آیتم یافت نشد")
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

    validateStore({ store })

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
        throw new Error("آیتم یافت نشد")
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

export async function getStoresKinds(): Promise<StoreKind[]> {
  try {
    const kinds = await db.storeKind.findMany()

    return kinds
  } catch (error) {
    throw error
  }
}

export async function getItemCategories(): Promise<ItemCategory[]> {
  try {
    const takeThisMany = 12

    const categories = await db.itemCategory.findMany({ take: takeThisMany })

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
      orderBy: { id: "desc" },
    })

    return stores
  } catch (error) {
    throw error
  }
}

export async function getStoreSchedule({ store }: { store: Store }) {
  try {
    const schedule = await db.storeSchedule.findMany({
      where: { storeId: store.id },
      orderBy: { dayNumber: "asc", startTime: "asc" },
    })

    return schedule
  } catch (error) {
    throw error
  }
}
