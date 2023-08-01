import { useState } from "react"

import {
  Form,
  useActionData,
  useLoaderData,
  V2_MetaFunction,
} from "@remix-run/react"

import type { LoaderArgs } from "@remix-run/server-runtime"

import type { Order, Store } from "@prisma/client"

import { Rating } from "@smastrom/react-rating"

import { getOrder } from "../queries.server/order.query.server"
import { getStore } from "../queries.server/store.query.server"
import { addComment, getComment } from "../queries.server/comment.query"
import { getOrderStatus } from "../queries.server/db.utils.query"

import {
  requireValidatedUser,
  validateNumberParam,
  validateOrder,
  validateStore,
} from "../utils/validate.server"

import { requirePhoneNumber } from "../utils/session.server"

import { getRateDescription } from "~/utils/utils"

import { Button } from "../components/button"
import { GlobalErrorBoundary } from "../components/error-boundary"

export const meta: V2_MetaFunction<LoaderType> = ({ data }) => {
  const { description, title } = data
    ? {
        description: `SnappFood Clone Comment on Order From ${
          data.store.name ?? ""
        }`,
        title: `SnappFood Clone Comment on Order From ${data.store.name ?? ""}`,
      }
    : { description: "No Comment found", title: "No Comment" }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type ActionType = { isSuccessful: boolean }

export const action = async ({ request, params }: any): Promise<ActionType> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const form = await request.formData()

    const orderId = Number(params.orderId)

    const orderRate = Number(form.get("order-rate"))

    const deliveryRate = Number(form.get("delivery-rate"))

    const description = form.get("description")

    validateNumberParam(orderRate)

    validateNumberParam(deliveryRate)

    validateNumberParam(orderId)

    const comment = await getComment({ orderId })

    if (comment) {
      throw new Response("شما قبلا نظر خود را ثبت کرده اید", { status: 403 })
    }

    const newComment = await addComment({
      description,
      orderId,
      score: orderRate,
      wasPositive: orderRate > 3,
      wasDeliveryPositive: deliveryRate > 3,
    })

    if (newComment) return { isSuccessful: true }

    return { isSuccessful: false }
  } catch (error) {
    throw error
  }
}

type LoaderType = {
  order: Order
  store: Store
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = validateOrder({ order, phoneNumber: user.phoneNumber })

    if (getOrderStatus({ order }).status !== "fullfilled") {
      throw new Response("سفارش هنوز تکمیل نشده است.", { status: 404 })
    }

    let store = await getStore({ storeId: order.storeId })

    store = validateStore({ store })

    const comment = await getComment({ orderId })

    if (comment) {
      throw new Response("شما قبلا نظر خود را ثبت کرده اید", { status: 403 })
    }

    return { order, store }
  } catch (error) {
    throw error
  }
}

export default function CommentPage() {
  const { order, store } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  const actionData = useActionData() as ActionType | undefined
  const [deliveryRate, setDeliveryRate] = useState(0)
  const [orderRate, setOrderRate] = useState(0)
  //   const [description, setdescription] = useState("")
  const [state, setState] = useState<"a" | "b">("a")

  return (
    <article>
      {state === "a" ? (
        <>
          <h1>امتیاز به سفارش از {store.name}</h1>

          <time> {order.billDate?.toLocaleString("fa")} </time>

          <p>تحویل سفارشتان چطور بود؟</p>

          <p data-rate={deliveryRate}>{getRateDescription(deliveryRate)}</p>

          <Rating
            style={{ maxWidth: 250 }}
            value={deliveryRate}
            onChange={setDeliveryRate}
          />

          <p>به سفارشتان از {store.name} چه امتیازی میدهید</p>

          <p data-rate={orderRate}>{getRateDescription(orderRate)}</p>

          <Rating
            style={{ maxWidth: 250 }}
            value={orderRate}
            onChange={setOrderRate}
          />

          <Button type="button"> ادامه </Button>
        </>
      ) : (
        <>
          {orderRate < 4 ? <p>چرا از سفارشتان ناراضی بودید؟</p> : null}

          <p>با نوشتن نظرتان درباره این سفارش به حفظ کیفیت کمک خواهید کرد.</p>

          <Form method="post">
            <input type="hidden" name="order-rate" value={orderRate} />

            <input type="hidden" name="delivery-rate" value={deliveryRate} />

            <textarea
              name="description"
              id=""
              cols={30}
              rows={10}
              placeholder={`نظرتان را درباره سفارش اینجا بنویسید`}
            ></textarea>

            <Button variant="faded" type="submit">
              ثبت
            </Button>
          </Form>
        </>
      )}
    </article>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
