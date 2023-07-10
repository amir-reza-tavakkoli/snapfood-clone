import { Link, useLoaderData, useRouteError } from "@remix-run/react"
import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import { requirePhoneNumber } from "~/utils/session.server"

import { getUserByPhone } from "~/queries.server/user.query.server"

import orderCss from "~/components/styles/order-summary.css"
import ordersPageCss from "./styles/orders-page.css"
import { validateUser } from "~/utils/validate.server"
import { getStore, getStoreSchedule } from "~/queries.server/store.query.server"
import { Store, storeSchedule } from "@prisma/client"
import { GlobalErrorBoundary } from "~/components/error-boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: orderCss },
  { rel: "stylesheet", href: ordersPageCss },
]

export const loader = async ({
  request,
  params,
}: LoaderArgs): Promise<{ schedule: storeSchedule[], store : Store }> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    validateUser({ user })

    const storeId = Number(params.storeId)

    const store = await getStore({ storeId })

    if (!store) {
      throw new Error("")
    }

    const schedule = await getStoreSchedule({ store })
    return { schedule, store }
  } catch (error) {
    throw error
  }
}

export default function StoreInfoPage() {
  const { schedule, store } = useLoaderData<typeof loader>()

  return (
    <main className="_orders-page">
    </main>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
