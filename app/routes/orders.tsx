import { useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { getOrders, getUserByPhone } from "~/utils/query.server"
import { requirePhoneNumber } from "~/utils/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  try {
    const user = await getUserByPhone({ phoneNumber })

    let isSignedIn
    if (!user) {
      isSignedIn = false
    }

    const orders = await getOrders({ phoneNumber })

    return { user, orders, isSignedIn }
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const data = useLoaderData<typeof loader>()

  return (
    <p>
      {data.isSignedIn && data.orders ? data.orders[0].addressId : undefined}
    </p>
  )
}
