import { Order, User } from "@prisma/client"
import { Link, useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { getOrders } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"

export const loader = async ({
  request,
}: LoaderArgs): Promise<Order[] | null> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    let orders = await getOrders({ phoneNumber })

    if (orders && orders.length > 0) {
      orders = orders.filter(
        order =>
          order.isBilled && order.isVerifiedByAdmin && order.isVerifiedByStore,
      )
    }

    return orders
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const orders = useLoaderData<typeof loader>()

  return (
    <div>
      {orders ? (
        orders.map(order => (
          <>
            {" "}
            <p>{order.id}</p>{" "}
            <Link to={`../order/${order.id}`}>Go To Order Page</Link>
          </>
        ))
      ) : (
        <p>No Orders Yet</p>
      )}
    </div>
  )
}
