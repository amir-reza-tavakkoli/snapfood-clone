import { Form, Link, useActionData, useLoaderData } from "@remix-run/react"
import { LoaderArgs, redirect } from "@remix-run/server-runtime"
import { db } from "~/utils/db.server"
import {
  billOrder,
  calculateOrder,
  getOrder,
  updateOrder,
} from "~/utils/order.query.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { useState } from "react"

export const action = async ({
  request,
  params,
}: any): Promise<{
  isSuccessful?: boolean
  isUnsuccessful?: boolean
  error?: Error
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)
    const orderId = Number(params.orderId)

    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("No Such User")
    }

    if (!orderId || isNaN(orderId)) {
      throw new Error("Bad Request")
    }

    const order = await getOrder({ orderId })

    if (!order || order.userPhoneNumber != phoneNumber) {
      throw new Error("bad req")
    }

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("No Such User")
    }

    const isSuccessful = !!(await billOrder({ orderId }))

    await updateOrder({ id: order.id, isInCart: false })

    if (isSuccessful)
      return {
        isSuccessful: true,
      }
    else {
      return {
        isUnsuccessful: true,
      }
    }
  } catch (error: any) {
    console.log(error)

    return {
      isUnsuccessful: true,
      error,
    }
  }
}

export const loader = async ({ request, params }: LoaderArgs) => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const orderId = Number(params.orderId)

    if (!orderId || isNaN(orderId)) {
      throw new Error("No Such Order")
    }

    const order = await getOrder({ orderId })

    if (
      !order ||
      order.userPhoneNumber != phoneNumber ||
      (order.isBilled && !order.isInCart)
    ) {
      throw new Error("Bad Request")
    }

    const user = await getUserByPhone({ phoneNumber })

    if (!user || user.isSuspended || !user.isVerified) {
      throw new Error("No Such User")
    }

    let price: number = order.totalPrice
    if (!price || price == 0) {
      price = (await calculateOrder({ orderId })).totalPrice
    }

    if (price == null || price == undefined) {
      throw new Error("Could Not Calculate Price")
    }

    return { user, order, price }
  } catch (error) {
    throw error
  }
}

export default function BillPage() {
  const { user, order, price } = useLoaderData<typeof loader>()
  const actionData = useActionData()

  return (
    <>
      Money Left :{user.credit}
      Bill order : {order.id}
      {price}
      <Form method="post">
        <button type="submit" disabled={user.credit < price || order.isBilled}>
          Bill Order
        </button>
      </Form>
      <p>
        {actionData?.isSuccessful || order.isBilled
          ? "Successfuly Billed"
          : undefined}
        {actionData?.isSuccessful || order.isBilled ? (
          <Link to={`home`}>Go To Order</Link>
        ) : undefined}
        {actionData?.isSuccessful ? "Could Not Perform" : undefined}
        {/* {actionData.isSuccessful ? setTimeout(redirect("/waiting",200) ,3000) : undefined} */}
        {actionData?.error?.message}
      </p>
    </>
  )
}
