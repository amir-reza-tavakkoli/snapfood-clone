import { db } from "../utils/db.server"

import { getOrder, getOrderItems } from "./order.query.server"
import { getUserByPhone } from "./user.query.server"
import { getStore } from "./store.query.server"
import { getOrderStatus } from "./db.utils.query"

import { checkStore, checkUser } from "../utils/validate.server"

import type { Comment, Order, Store, StoreHasItems } from "@prisma/client"

import { evaluateComment } from "./evaluate.server"

import {
  MAX_COMMENT_SIZE,
  RESPONDED_BY,
  SCORE_ROUNDING,
  type StoreComment,
} from "../constants"
import { calculateScore } from "~/utils/utils.server"

export async function addComment({
  orderId,
  description,
  wasPositive,
  score,
  response,
  responsedBy,
  wasDeliveryPositive,
}: Partial<Comment> & {
  orderId: number
  score: number
  wasPositive: boolean
  wasDeliveryPositive: boolean
  responsedBy?: RESPONDED_BY
}): Promise<Comment> {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    if (getOrderStatus({ order }).status !== "fullfilled") {
      throw new Response("سفارش هنوز کامل نشده است", { status: 404 })
    }

    const user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    checkUser({ user })

    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (comment) {
      throw new Response("نظر قبلا وارد شده", { status: 404 })
    }

    if (!score) {
      throw new Response("امتیاز معتبر نیست", { status: 404 })
    }

    if (!evaluateComment({ description, response, responsedBy, score })) {
      throw new Response("نظر مورد تایید واقع نشد", { status: 404 })
    }

    const store = await getStore({ storeId: order.storeId })

    if (!store) {
      throw new Response("فروشگاه نامعتبر است", { status: 404 })
    }

    checkStore({ store })

    const orderItems = await db.orderHasItems.findMany({
      where: { orderId: order.id },
    })

    if (description) description = description.slice(0, MAX_COMMENT_SIZE)

    if (response) response = response.slice(0, MAX_COMMENT_SIZE)

    const newStoreScore = calculateScore({ newScore: score, store })

    const [newComment, newStore] = await db.$transaction([
      db.comment.create({
        data: {
          wasPositive,
          wasDeliveryPositive,
          score,
          description,
          orderId,
          response,
          responsedBy,
          isVisible: true,
        },
      }),
      db.store.update({
        where: { id: store.id },
        data: {
          scoreCount: store.scoreCount + 1,
          score: newStoreScore,
        },
      }),
    ])

    if (!newComment || !newStore) {
      throw new Response("مشکلی پیش آمد", { status: 404 })
    }

    Promise.all(
      orderItems.map(async orderItem => {
        const storeItem = await db.storeHasItems.findUnique({
          where: {
            storeId_itemId: { itemId: orderItem.itemId, storeId: store.id },
          },
        })

        if (!storeItem) return

        await db.storeHasItems.update({
          where: {
            storeId_itemId: { itemId: orderItem.itemId, storeId: store.id },
          },
          data: {
            scoreCount: storeItem.scoreCount + 1,
            score: calculateScore({ store: storeItem, newScore: score }),
          },
        })
      }),
    )

    return newComment
  } catch (error) {
    throw error
  }
}

export async function changeComment({
  orderId,
  description,
  wasPositive,
  score,
  isVerified,
  responsedBy,
  wasDeliveryPositive,
  isVisible,
  response,
}: Partial<Comment> & { orderId: number }): Promise<Comment> {
  try {
    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (!comment) {
      throw new Response("چنین کامنتی وجود ندارد", { status: 404 })
    }

    evaluateComment({
      description,
      response,
      responsedBy: responsedBy as RESPONDED_BY,
      score,
    })

    const changedComment = await db.comment.update({
      data: {
        wasPositive,
        score,
        description,
        isVerified,
        isVisible,
        responsedBy,
        wasDeliveryPositive,
        response,
      },
      where: {
        orderId,
      },
    })

    return changedComment
  } catch (error) {
    throw error
  }
}

export async function getComment({ orderId }: { orderId: number }) {
  try {
    const order = await getOrder({ orderId })

    if (!order) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    const comment = await db.comment.findUnique({ where: { orderId } })

    return comment
  } catch (error) {
    throw error
  }
}

export async function getVerifiedItemComments({
  itemId,
  storeId,
}: {
  itemId: number
  storeId: number
}) {
  try {
    const takeThisMuch = 12

    const itemsInOrder = await db.orderHasItems.findMany({
      where: {
        itemId,
      },
      take: takeThisMuch,
    })

    let orders = (await Promise.all(
      itemsInOrder.map(item =>
        db.order.findUnique({
          where: {
            id: item.orderId,
          },
        }),
      ),
    )) as unknown as Order[]

    orders = orders.filter(order => order && order.storeId === storeId)

    let comments = await Promise.all(
      orders.map(async order => {
        const comment = await db.comment.findUnique({
          where: {
            orderId: order.id,
          },
        })

        if (!order.userPhoneNumber || !comment) {
          return
        }

        const user = await getUserByPhone({
          phoneNumber: order.userPhoneNumber,
        })

        if (!user) {
          throw new Response("کاربر نظر معتبر نیست", { status: 404 })
        }

        return {
          user,
          order,
          comment,
        }
      }),
    )

    return comments
  } catch (error) {
    throw error
  }
}

export async function getStoreComments({
  storeId,
  isVisible = false,
}: {
  storeId: number
  isVisible?: boolean
}): Promise<StoreComment[]> {
  try {
    const takeThisMuch = 12

    let orders = await db.order.findMany({
      where: {
        storeId,
        isBilled: true,
      },
      take: takeThisMuch,
    })

    let users = await Promise.all(
      orders.map(order =>
        db.user.findUnique({
          where: {
            phoneNumber: order.userPhoneNumber,
          },
        }),
      ),
    )

    let comments = await Promise.all(
      orders.map(order =>
        db.comment.findUnique({
          where: {
            orderId: order.id,
          },
        }),
      ),
    )

    if (isVisible)
      comments = comments.filter(comment => comment && comment.isVisible)

    let storecomments = await Promise.all(
      comments.map(async comment => {
        if (!comment) {
          return
        }

        const order = orders.find(order => order.id === comment.orderId)

        if (!order) {
          return
        }

        const user = users.find(
          user => user?.phoneNumber === order.userPhoneNumber,
        )

        const items = (await getOrderItems({ orderId: order.id })).items

        if (!user) {
          throw new Response("کاربر نظر معتبر نیست", { status: 404 })
        }

        return { user, order, comment, items }
      }),
    )

    storecomments = storecomments.filter(item => item !== undefined)

    return storecomments as unknown as StoreComment[]
  } catch (error) {
    throw error
  }
}
