import { useState } from "react"

import {
  Form,
  useActionData,
  useLoaderData,
  V2_MetaFunction,
} from "@remix-run/react"

import {
  ActionArgs,
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Comment, Order, Store } from "@prisma/client"

import { Rating } from "@smastrom/react-rating"

import { getOrder } from "../queries.server/order.query.server"
import { getStore } from "../queries.server/store.query.server"
import { addComment, getComment } from "../queries.server/comment.query"
import { getOrderStatus } from "../queries.server/db.utils.query"

import {
  validateNumberParam,
  checkOrder,
  checkStore,
  requireValidatedUser,
} from "../utils/validate.server"

import { requirePhoneNumber } from "../utils/session.server"

import { getFormattedDate, getRateDescription } from "../utils/utils"

import { Button } from "../components/button"
import { GlobalErrorBoundary } from "../components/error-boundary"

import {
  CLIENT_CACHE_DURATION,
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
} from "../constants"

import pageCss from "./styles/add-comment-page.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]

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

export const action = async ({
  request,
  params,
}: ActionArgs): Promise<ActionType> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const form = await request.formData()

    const orderId = Number(params.orderId)

    const orderRate = Number(form.get("order-rate"))

    const deliveryRate = Number(form.get("delivery-rate"))

    const description = form.get("description")

    if (description && typeof description !== "string") {
      throw new Response("توضیحات صحیح نیست", { status: 404 })
    }

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
  comment: Comment | null
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireValidatedUser(request)

    const orderId = Number(params.orderId)

    validateNumberParam(orderId)

    let order = await getOrder({ orderId })

    order = checkOrder({ order, phoneNumber: user.phoneNumber })

    if (getOrderStatus({ order }).status !== "fullfilled") {
      throw new Response("سفارش هنوز تکمیل نشده است.", { status: 404 })
    }

    let store = await getStore({ storeId: order.storeId })

    store = checkStore({ store })

    const comment = await getComment({ orderId })

    return json(
      { order, store, comment },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
        },
      },
    )
  } catch (error) {
    throw error
  }
}

export default function CommentPage() {
  const { order, store, comment } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  const actionData = useActionData() as ActionType | undefined

  const [deliveryRate, setDeliveryRate] = useState(0)

  const [orderRate, setOrderRate] = useState(0)

  const [pageState, setPageState] = useState<"score" | "description">("score")

  return (
    <article className="add-comment-page">
      {comment ? (
        <>
          <h1 className="_success">نظر شما با موفقیت ثبت شده است</h1>
        </>
      ) : pageState === "score" ? (
        <>
          <h1>امتیاز به سفارش از {store.name}</h1>

          <time dateTime={order.billDate?.toString()}>
            {getFormattedDate(new Date(order.billDate ?? order.updatedAt))}
          </time>

          <p>تحویل سفارشتان چطور بود؟</p>

          <p
            data-rate={deliveryRate}
            className={deliveryRate > 3 ? "_rate _success" : "_rate _error"}
          >
            {getRateDescription(deliveryRate)}
          </p>

          <Rating
            style={{ maxWidth: 250 }}
            value={deliveryRate}
            onChange={setDeliveryRate}
            isRequired
          />

          <p>به سفارشتان از {store.name} چه امتیازی میدهید</p>

          {order.billDate ? (
            <p
              data-rate={orderRate}
              className={orderRate > 3 ? "_rate _success" : "_rate _error"}
            >
              {getRateDescription(orderRate)}
            </p>
          ) : null}

          <Rating
            style={{ maxWidth: 250 }}
            value={orderRate}
            onChange={setOrderRate}
            isRequired
          />

          <Button
            variant="accent"
            type="button"
            disabled={deliveryRate === 0 || orderRate === 0}
            onClick={() => setPageState("description")}
          >
            ادامه
          </Button>
        </>
      ) : (
        <>
          {orderRate < 4 ? (
            <p className="_error">چرا از سفارشتان ناراضی بودید؟</p>
          ) : null}

          <p className="_help-us">
            با نوشتن نظرتان درباره این سفارش به حفظ کیفیت کمک خواهید کرد.
          </p>

          <Form method="post">
            <input type="hidden" name="order-rate" value={orderRate} />

            <input type="hidden" name="delivery-rate" value={deliveryRate} />

            <textarea
              name="description"
              id="__description"
              cols={30}
              rows={10}
              placeholder={`نظرتان را درباره سفارش اینجا بنویسید`}
              maxLength={MAX_DESCRIPTION_LENGTH}
              minLength={MIN_DESCRIPTION_LENGTH}
            ></textarea>

            <Button variant="accent" type="submit">
              ثبت
            </Button>
          </Form>
        </>
      )}
    </article>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
