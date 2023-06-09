import { useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { getOrders } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    const orders = await getOrders({ phoneNumber })

    return { user, orders }
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const { user, orders } = useLoaderData<typeof loader>()

  return <p></p>
}
