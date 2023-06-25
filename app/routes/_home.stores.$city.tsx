import type { LoaderArgs } from "@remix-run/node"
import { Link, Outlet, useLoaderData, useSearchParams } from "@remix-run/react"

import { getUserByPhone } from "~/utils/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import { User } from "@prisma/client"
import { validateUser } from "~/utils/utils.server"

export const loader = async ({ request }: LoaderArgs): Promise<User> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    let user = await getUserByPhone({ phoneNumber })

    user = validateUser({ user })

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
