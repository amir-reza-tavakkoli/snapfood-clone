import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, Outlet, useActionData, useLoaderData } from "@remix-run/react"

import { getUserByPhone } from "~/utils/user.query.server"
import { requirePhoneNumber } from "~/utils/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("Not SuchUser")
    }

    return { user }
  } catch (error) {
    throw error
  }
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <>
      <p>{user.lastName}</p>
      <Outlet></Outlet>
    </>
  )
}
