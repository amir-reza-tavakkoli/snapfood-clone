import type { LoaderArgs } from "@remix-run/node"
import { Link, Outlet, useLoaderData } from "@remix-run/react"

import { getUserByPhone } from "~/utils/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { User } from "@prisma/client"

export const loader = async ({ request }: LoaderArgs):Promise<User> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("Not SuchUser")
    }

    if (user.isSuspended || !user.isVerified) {
      throw new Error("User Is Not Verified Or Suspended")
    }

    return user
  } catch (error) {
    throw error
  }
}

export default function Index() {
  const user = useLoaderData<typeof loader>()

  return (
    <>
      <p>{user.lastName}</p>
      <Outlet></Outlet>
    </>
  )
}
