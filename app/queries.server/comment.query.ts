import {
  getFullOrderItems,
  getOrder,
  getOrderItems,
} from "./order.query.server"
import type { Comment, Item, Order, User } from "@prisma/client"
import { getUserByPhone } from "./user.query.server"
import { db } from "../utils/db.server"

export async function addComment({
  orderId,
  description,
  wasPositive = false,
  score,
  wasDeliveryPositive = false,
}: Partial<Comment> & { orderId: number; score: number }): Promise<Comment> {
  try {
    const order = await getOrder({ orderId })

    if (
      !order ||
      !order.isBilled ||
      order.isCanceled ||
      !order.isVerifiedByAdmin ||
      !order.isVerifiedByStore
    ) {
      throw new Error("چنین سفارشی وجود ندارد")
    }

    const user = await getUserByPhone({ phoneNumber: order.userPhoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("چنین کاربری وجود ندارد")
    }

    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (comment) {
      throw new Error("Comment Already Exists")
    }

    // need to  evaluate comment

    const newComment = await db.comment.create({
      data: {
        wasPositive,
        wasDeliveryPositive,
        score,
        description,
        orderId,
      },
    })

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
  isVisible,
  response,
}: Comment): Promise<Comment> {
  try {
    const comment = await db.comment.findUnique({
      where: {
        orderId,
      },
    })

    if (!comment) {
      throw new Error("No Such Comment")
    }
    // need to evaluate comment

    const changedComment = await db.comment.update({
      data: {
        wasPositive,
        score,
        description,
        isVerified,
        isVisible,
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
      throw new Error("چنین سفارشی وجود ندارد")
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
    const itemsInOrder = await db.orderHasItems.findMany({
      where: {
        itemId,
      },
      take: 12,
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
          throw new Error("خطا")
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

export type StoreComment = (
  | {
      user: User
      order: Order
      comment: Comment
      items: (Item | null)[]
    }
  | undefined
)

export async function getStoreComments({
  storeId,
  isVisible = false,
}: {
  storeId: number
  isVisible?: boolean
}): Promise<StoreComment[]> {
  try {
    const takeThisMany = 12
    let orders = await db.order.findMany({
      where: {
        storeId,
      },
      take: takeThisMany,
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
// console.log(comments, "p");

    if (isVisible)
      comments = comments.filter(comment => comment && comment.isVisible)

    let storecomments = await Promise.all(
      comments.map(async comment => {
        if (!comment) {
          return
        }

        const order = orders.find(order => order.id === comment?.orderId)

        if (!order) {
          return
        }

        const user = users.find(
          user => user?.phoneNumber === order.userPhoneNumber,
        )

        const items = (await getOrderItems({ orderId: order.id })).items

        if (!user) {
          return
        }

        return { user, order, comment, items }
      }),
    )

    storecomments = storecomments.filter(item => item != undefined)

    // console.log(storecomments,"ppp")

    return storecomments
  } catch (error) {
    throw error
  }
}
