import { useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"
import { db } from "~/utils/db.server"
import { getUserByPhone } from "~/utils/query.server"
import { requirePhoneNumber } from "~/utils/session.server"

import { useState } from "react"

export const loader = async ({ request, params }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  const orderId = params.orderId

  if (!orderId) {
    throw new Error("bad req")
  }

  const order = await db.order.findUnique({
    where: {
      id: Number(orderId),
    },
  })

  if (!order || order.userPhoneNumber != phoneNumber) {
    throw new Error("bad req")
  }

  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    return { user, order }
  } catch (error) {
    throw error
  }
}

export default function Comment() {
  const loaderData = useLoaderData<typeof loader>()
  const [rate, setRate] = useState(0)
  console.log(rate)

  return <></>
}
