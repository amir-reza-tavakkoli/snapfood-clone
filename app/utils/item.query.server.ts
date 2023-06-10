import type { Item } from "@prisma/client"
import { db } from "./db.server"

export async function updateOrCreateItem({
  id,
  avatarUrl,
  basePrice,
  description,
  isAvailible,
  isVerified,
  itemCategoryName,
  name,
}: {
  id?: number
  avatarUrl?: string
  basePrice?: number
  description?: string
  isAvailible?: boolean
  isVerified?: boolean
  itemCategoryName?: any
  name?: string
}): Promise<Item | undefined> {
  try {
    const isItemCreated = await db.item.findUnique({ where: { id } })

    if (!isItemCreated && name) {
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
    }

    if (id) {
      const item = await db.item.update({
        where: {
          id,
        },
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
    }
  } catch (error) {
    throw error
  }
}

export async function getItem({
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
