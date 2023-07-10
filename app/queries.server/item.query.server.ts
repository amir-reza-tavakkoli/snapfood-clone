import type { Item, ItemCategory } from "@prisma/client"

import { db } from "../utils/db.server"

export async function createItem({
  avatarUrl,
  basePrice,
  description,
  isAvailible,
  isVerified,
  itemCategoryName,
  name,
}: Partial<Item> & {
  itemCategoryName: any
  name: string
}): Promise<Item | undefined> {
  try {
    if (!name || !itemCategoryName) {
      throw new Response("آیتم با این مشخصات قابل سخت نیست", { status: 404 })
    }

    const item = await db.item.create({
      data: {
        avatarUrl,
        basePrice,
        description,
        isAvailible,
        isVerified,
        itemCategoryName,
        name,
      },
    })

    return item
  } catch (error) {
    throw error
  }
}

export async function updateItem({
  id,
  avatarUrl,
  basePrice,
  description,
  isAvailible,
  isVerified,
  itemCategoryName,
  name,
}: Partial<Item> & { id: number }): Promise<Item> {
  try {
    const previousItem = await db.item.findUnique({ where: { id } })

    if (!previousItem) {
      throw new Response("آیتم با این مشخصات موجود نیست", { status: 404 })
    }

    const item = await db.item.update({
      where: { id },
      data: {
        avatarUrl,
        basePrice,
        description,
        isAvailible,
        isVerified,
        itemCategoryName,
        name,
      },
    })

    return item
  } catch (error) {
    throw error
  }
}

export async function getItemById({
  itemId,
}: {
  itemId: number
}): Promise<Item | null> {
  try {
    const item = await db.item.findUnique({
      where: {
        id: itemId,
      },
    })

    return item
  } catch (error) {
    throw error
  }
}

export async function deleteItemById({
  itemId,
}: {
  itemId: number
}): Promise<Item | null> {
  try {
    const item = await db.item.delete({
      where: {
        id: itemId,
      },
    })

    return item
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