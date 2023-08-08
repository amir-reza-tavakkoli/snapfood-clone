import { db } from "../utils/db.server"

import type {
  Item,
  Store,
  StoreHasItems,
  StoreKind,
  storeSchedule,
} from "@prisma/client"

import { getOrder, getOrderItems } from "./order.query.server"

import { checkStore } from "../utils/validate.server"
import { checkCity } from "../utils/validate.server"

import {
  DEFAULT_TAKE_THIS_MUCH,
  JoinedOrderItem,
  NOT_MAIN_CATEGORIES,
} from "../constants"

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
    await checkCity({ cityName })

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
}): Promise<{ items: Item[]; itemsInStore: StoreHasItems[] }> {
  try {
    const itemsInStore = await db.storeHasItems.findMany({
      where: { storeId },
      orderBy: {
        itemId: "desc",
      },
    })

    const items = (await Promise.all(
      itemsInStore.map(itemInStore =>
        db.item.findUnique({
          where: {
            id: itemInStore.itemId,
          },
        }),
      ),
    )) as Item[]

    return { items, itemsInStore }
  } catch (error) {
    throw error
  }
}

export async function getFullStoreItems({
  storeId,
}: {
  storeId: number
}): Promise<JoinedOrderItem[]> {
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
      const found = items.find(item => item && item.id === itemInStore.itemId)

      if (!found) {
        throw new Response("آیتم یافت نشد", { status: 404 })
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
  take = DEFAULT_TAKE_THIS_MUCH,
}: {
  storeId: number
  take?: number
}): Promise<string[]> {
  try {
    const store = await getStore({ storeId })

    checkStore({ store })

    const { items } = await getStoreItems({ storeId })

    const storeCategories: string[] = []

    items.forEach(item => {
      if (take <= 0) return

      item &&
      item.itemCategoryName &&
      !storeCategories.includes(item.itemCategoryName) &&
      !NOT_MAIN_CATEGORIES.includes(item.itemCategoryName)
        ? storeCategories.push(item.itemCategoryName) && take--
        : undefined
    })

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
}): Promise<JoinedOrderItem[]> {
  try {
    const itemsInStore = await db.storeHasItems.findMany({
      where: { storeId },
      orderBy: {
        itemId: "desc",
      },
    })

    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("سفارش وجود ندارد", { status: 404 })
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
      const found = items.find(item => item && item.id === itemInStore.itemId)

      if (!found) {
        throw new Response("آیتم یافت نشد", { status: 404 })
      }

      const itemInOrder = itemsInOrder.find(
        item => item && item.itemId === itemInStore.itemId,
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

export async function getStoreSchedule({
  store,
}: {
  store: Store
}): Promise<storeSchedule[]> {
  try {
    const schedule = await db.storeSchedule.findMany({
      where: { storeId: store.id },
      orderBy: { dayNumber: "asc" },
    })

    return schedule
  } catch (error) {
    throw error
  }
}

export async function getStoresWithDiscount({
  stores,
  take = undefined,
}: {
  stores: Store[] | null
  take?: number
}): Promise<Store[]> {
  try {
    if (!stores) {
      throw new Response("فروشگاهی وجود ندارد", { status: 404 })
    }

    const withDiscount = await Promise.all(
      stores.filter(async store => {
        if (take) {
          take--
        }

        if (take && take <= 0) {
          return false
        }

        const items = await getStoreItems({ storeId: store.id })

        const isWithDiscount = items.itemsInStore.find(
          item => item.discountPercent && item.discountPercent > 0,
        )

        if (isWithDiscount) return store
      }),
    )

    return withDiscount
  } catch (error) {
    throw error
  }
}

export async function getStoresWithFreeShipment({
  stores,
  take,
}: {
  stores: Store[] | null
  take?: number
}): Promise<Store[]> {
  try {
    if (!stores) {
      throw new Response("فروشگاهی وجود ندارد", { status: 404 })
    }

    const withFreeShipment = stores.filter(store => {
      if (take) {
        take--
      }

      if (take && take <= 0) {
        return false
      }

      return store.baseShipmentPrice === 0 && store.perUnitShipmentPrice === 0
    })

    return withFreeShipment
  } catch (error) {
    throw error
  }
}

export async function getStoresByCategory({
  category,
  stores,
}: {
  category: string
  stores: Store[]
}): Promise<Store[]> {
  try {
    const newStores = await Promise.all(
      stores.filter(async store => {
        const items = (await getStoreItems({ storeId: store.id })).items

        const result = items.find(item => item.itemCategoryName === category)

        return !!result
      }),
    )

    return newStores
  } catch (error) {
    throw error
  }
}
