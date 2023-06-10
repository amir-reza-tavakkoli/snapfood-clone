import { Address, User } from "@prisma/client"
import { Link, Outlet, useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"
import { createContext, useContext, useEffect } from "react"
import { getNearestAddress } from "~/utils/address.query.server"
import { calculateOrder } from "~/utils/order.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"

export const loader = async ({
  request,
}: LoaderArgs): Promise<{ address: Address | null; user: User | null }> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    const address = await getNearestAddress({ phoneNumber })
    console.log("mmmmm", await calculateOrder({ orderId: 4 }))

    return { address, user }
  } catch (error) {
    throw error
  }
}

export default function Home() {
  const { address, user } = useLoaderData<typeof loader>()

  useEffect(() => {
    if (address && address.id)
      localStorage.setItem("addressId", address?.id.toString())
  }, [address?.id])

  return (
    <>
      <form action="/logout" method="post">
        <button type="submit">Logout</button>
      </form>
      <p>homeeeeee</p>
      <Outlet></Outlet>
    </>
  )
}
