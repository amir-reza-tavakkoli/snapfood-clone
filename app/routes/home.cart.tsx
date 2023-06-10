import { LoaderArgs } from "@remix-run/server-runtime"
import type {
  Address,
  Comment,
  Item,
  Order,
  Store,
  OrderHasItems,
  StoreHasItems,
} from "@prisma/client"
import { getFullCart } from "~/utils/cart.query.server"
import { getUser, requirePhoneNumber } from "~/utils/session.server"
import { useLoaderData } from "@remix-run/react"
import { FullOrderItem } from "~/utils/order.query.server"

export const loader = async ({
  request,
}: LoaderArgs): Promise<(FullOrderItem | undefined)[][] | undefined> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const cart = await getFullCart({ phoneNumber })

    return cart
  } catch (error) {
    throw error
  }
}

export default function Orders() {
  const cart = useLoaderData<typeof loader>()
  // console.log(cart)

  return (
    <div>
      {cart.map(order => (
        <div>
          {order.map(item =>
            item ? <p>{item.name + " " + item.count}</p> : undefined,
          )}
        </div>
      ))}
    </div>
  )
}
