import { Order, User } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { getOrders } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"

export const loader = async ({
  request,
}: LoaderArgs): Promise<{ user: User; orders: Order[] | null }> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    const orders = await getOrders({ phoneNumber })

    return { user, orders }
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const { user, orders } = useLoaderData<typeof loader>()

  return (
    <div>
      {orders ? orders.map((order: any) => <p>{order.id}</p>) : undefined}
    </div>
  )
}
