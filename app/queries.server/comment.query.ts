import { db } from "../utils/db.server"

import { getOrder, getOrderItems } from "./order.query.server"
import { getUserByPhone } from "./user.query.server"
import { getStore } from "./store.query.server"
import { getOrderStatus } from "./db.utils.query"

import { validateUser } from "../utils/validate.server"

import type { Comment, Order, Store, StoreHasItems } from "@prisma/client"

import { evaluateComment } from "./evaluate.server"

import {
  MAX_COMMENT_SIZE,
  SCORE_ROUNDING,
  type StoreComment,
} from "../constants"

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
}): Promise<Comment> {
  try {
    const order = await getOrder({ orderId })

    if (!order || getOrderStatus({ order }).status !== "inProgress") {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    const user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    validateUser({ user })

    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    const store = await getStore({ storeId: order.storeId })

    if (comment) {
      throw new Response("نظر به درستی وارد نشده", { status: 404 })
    }

    if (!score || score > 5 || score < 0) {
      throw new Response("امتیاز معتبر نیست", { status: 404 })
    }

    if (!wasPositive || !wasDeliveryPositive) {
      throw new Response("نظر به درستی وارد نشده", { status: 404 })
    }

    if (!store) {
      throw new Response("فروشگاه نامعتبر است", { status: 404 })
    }

    if (description && evaluateComment({ description })) {
      throw new Response("نظر مورد تایید واقع نشد", { status: 404 })
    }

    const orderItems = await db.orderHasItems.findMany({
      where: { orderId: order.id },
    })

    if (description) description = description.slice(0, MAX_COMMENT_SIZE)

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

export function calculateScore({
  newScore,
  store,
}: {
  newScore: number
  store: Store | StoreHasItems
}) {
  try {
    const score = Number(
      (
        (store.score * store.scoreCount + newScore) /
        (store.scoreCount + 1)
      ).toFixed(SCORE_ROUNDING),
    )

    if (isNaN(score)) {
      throw new Response("محاسبه امتیاز ممکن نیست", { status: 404 })
    }
    return score
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

    // need to evaluate comment

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

    if (
      !order ||
      !order.isBilled ||
      order.isCanceled ||
      !order.isVerifiedByAdmin ||
      !order.isVerifiedByStore
    ) {
      throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
    }

    const comment = await db.comment.findUnique({ where: { orderId } })

    return comment
  } catch (error) {
    throw error
  }
}

export async function getStoreItemComments({
  itemId,
  storeId,
}: {
  itemId: number
  storeId: number
}) {
  try {
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

        if (
          !order.userPhoneNumber ||
          !comment
          // filter unverified
        ) {
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

    storecomments = storecomments.filter(item => item != undefined)

    return storecomments as unknown as StoreComment[]
  } catch (error) {
    throw error
  }
}
