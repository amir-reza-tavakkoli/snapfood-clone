import { getOrder, getOrderItems } from "./order.query.server"
import type { Comment, Order, User } from "@prisma/client"
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

export async function getItemComments({
  itemId,
  storeId,
}: {
  itemId: number
  storeId: number
}) {
  try {
    const item = await db.item.findUnique({ where: { id: itemId } })

    const itemsInOrder = await db.orderHasItems.findMany({
      where: {
        itemId,
      },
      take: 12,
    })

    let orders = await Promise.all(
      itemsInOrder.map(item =>
        db.order.findUnique({
          where: {
            id: item.orderId,
          },
        }),
      ),
    )

    orders = orders.filter(order => order && order.storeId == storeId)

    let comments = await Promise.all(
      orders.map(order =>
        db.comment.findUnique({
          where: {
            orderId: order?.id,
          },
        }),
      ),
    )

    comments = comments.filter(comment => comment ?? undefined)

    return comments
  } catch (error) {
    throw error
  }
}

// type StoreComment =

export async function getStoreComments({
  storeId,
  isVisible = false,
}: {
  storeId: number
  isVisible?: boolean
}) {
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

    if (isVisible)
      comments = comments.filter(comment => comment && comment.isVisible)

    let xxx = await Promise.all(
      comments.map(async comment => {
        if (!comment) {
          return
        }

        const order = orders.find(order => order.id == comment?.orderId)

        if (!order) {
          return
        }

        const user = users.find(
          user => user?.phoneNumber == order.userPhoneNumber,
        )

        const items = (await getOrderItems({ orderId: order.id })).items

        if (!user) {
          return
        }

        return { user, order, comment, items }
      }),
    )

    xxx = xxx.filter(item => item != undefined)

    console.log(xxx)

    return xxx
  } catch (error) {
    throw error
  }
}
