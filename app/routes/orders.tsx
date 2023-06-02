import { User } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"
import { db } from "~/utils/db.server"
import { requirePhoneNumber } from "~/utils/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  const user = await db.user.findUnique({
    where: {
      phoneNumber,
    },
  })

  if (!user) {
    error: "not signed in"
  }

  const orders = await db.order.findMany({
    where: {
      userPhoneNumber: user?.phoneNumber,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  })

  return { user, orders }
}

export default function Orders() {
  const data = useLoaderData<typeof loader>()
  return <p>{data.orders[0].addressId}</p>
}
