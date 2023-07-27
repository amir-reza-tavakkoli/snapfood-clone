import { Link, useLoaderData, useRouteError } from "@remix-run/react"
import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

// import orderCss from "~/components/styles/order-summary.css"
import ordersPageCss from "./styles/store-info.css"
import {
  requireValidatedUser,
  validateNumberParam,
  validateUser,
} from "~/utils/validate.server"
import {
  getStore,
  getStoreCategories,
  getStoreSchedule,
  getStoresKinds,
} from "~/queries.server/store.query.server"
import { Address, Store, storeSchedule } from "@prisma/client"
import { GlobalErrorBoundary } from "~/components/error-boundary"
import { DEFAULT_IMG_PLACEHOLDER } from "~/constants"
import { getFullAddress } from "~/utils/utils"
import { getAddressById } from "~/queries.server/address.query.server"
import { Icon } from "~/components/icon"
import { getStoreComments, StoreComment } from "~/queries.server/comment.query"
import { getFormattedDate } from "~/utils/utils"

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: ordersPageCss },
]

type LoaderType = {
  schedule: storeSchedule[]
  store: Store
  categories: string[]
  address: Address
  comments: StoreComment[]
}

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const storeId = validateNumberParam(Number(params.storeId))

    const store = await getStore({ storeId })

    if (!store) {
      throw new Error("")
    }

    const schedule = await getStoreSchedule({ store })

    const categories = await getStoreCategories({ storeId })

    const address = await getAddressById({ addressId: store.addressId })

    if (!address) {
      throw new Error("")
    }

    const comments = await getStoreComments({ storeId, isVisible: true })
    // console.log("ooo","\n", comments);

    return { schedule, store, categories, address, comments }
  } catch (error) {
    throw error
  }
}

export default function StoreInfoPage() {
  const { schedule, store, categories, address, comments } = useLoaderData<
    typeof loader
  >() as unknown as LoaderType

  const today = new Date(Date.now())
  console.log(schedule)

  const todays = schedule
    .filter(s => s.dayNumber === today.getDay())
    .find(s => s.startTime < today.getHours() && s.endTime > today.getHours())

  console.log("o", comments)

  return (
    <main className="store-info">
      <address aria-label="Info">
        <img src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER} alt="" />
        <div>
          <h1>{store.name}</h1>
          <small>{categories.join(", ")}</small>
          <Icon name="navigation" color="faded"></Icon>
          <p>{getFullAddress(address)}</p>
        </div>
      </address>

      <dl>
        <span>
          <dt>ساعات کاری</dt>
          <Icon name="user"></Icon>
          <dd>
            {todays ? (
              <span className="_store-state">
                <span className="_store-open">باز</span>
                امروز از ساعت
                <span> {todays.startTime.toLocaleString("fa")} </span>
                تا
                <span> {todays.endTime.toLocaleString("fa")} </span>
              </span>
            ) : (
              <span className="_store-closed">بسته</span>
            )}
          </dd>
        </span>

        <span>
          <dt>شیوه های پرداخت</dt>
          <Icon name="pay"></Icon>
          <dd>
            {store.takesOfflineOrder ? "آفلاین" : null}
            {store.takesOnlineOrder ? " ,آنلاین" : null}
          </dd>
        </span>
        <span>
          <dt>حداقل سبد خرید</dt>
          <Icon name="cart"></Icon>
          <dd>{store.minOrderPrice.toLocaleString("fa")}</dd>
        </span>
      </dl>

      <div>
        <p className="nonvisual">امتیازات فروشگاه</p>
        <span>

          <span className="_store-score">
            {store.score.toLocaleString("fa")}
            <Icon name="star"></Icon>
          </span>
        </span>

        <span>
          {" "}
          <span> امتیاز </span>{" "}
          <span>
            از مجموع
            <span> {store.scoreCount.toLocaleString("fa")} </span>
            نظر
          </span>
        </span>
      </div>

      <p>نظرات کاربران</p>
      <ul>
        {comments.map((comment, index) =>
          comment &&
          comment.comment &&
          comment.comment.description &&
          comment.comment.isVisible &&
          comment.comment.isVerified &&
          comment.order.billDate &&
          comment.comment.score ? (
            <li key={index} className="_comment">
              <div>
                <span className="_name"> {comment?.user?.firstName}</span>
                <span className="_score">
                  {" "}
                  {comment?.comment?.score.toLocaleString("fa")}{" "}
                  <Icon name="star"></Icon>{" "}
                </span>
                <time dateTime={comment.order.billDate.toString()}>
                  {/* {comment.order.billDate
                    ? getFormattedDate(comment?.order.billDate)
                    : null} */}
                </time>
              </div>
              <div>
                <span className="_description">
                  {" "}
                  {comment.comment.description}
                </span>
                <ul>
                  {comment && comment.items
                    ? comment.items.map((item, index) =>
                        item ? (
                          <li className="_item" key={index}>
                            {" "}
                            {item?.name}
                          </li>
                        ) : null,
                      )
                    : null}
                </ul>
              </div>
            </li>
          ) : null,
        )}
      </ul>
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
