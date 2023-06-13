import { LoaderArgs } from "@remix-run/server-runtime"
import { Link, useLoaderData } from "@remix-run/react"

import { requirePhoneNumber } from "~/utils/session.server"

import { getCart } from "~/utils/cart.query.server"
import { FullOrderItem } from "~/utils/order.query.server"
import { getUserByPhone } from "~/utils/user.query.server"

export const loader = async ({
  request,
}: LoaderArgs): Promise<(FullOrderItem | undefined)[][] | undefined> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("Invalid User")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("User Is Not Verified Or Suspended")
    }

    const cart = await getCart({ phoneNumber })

    return cart
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const cart = useLoaderData<typeof loader>()

  return (
    <div>
      {cart && cart.length != 0 ? (
        cart.map(order => (
          <div>
            <Link to={`../bill/${order[0]?.orderId}`}> Bill </Link>
            {order.map(item =>
              item ? <p>{item.name + " " + item.count} </p> : undefined,
            )}
          </div>
        ))
      ) : (
        <p>No Order In Cart</p>
      )}
    </div>
  )
}
