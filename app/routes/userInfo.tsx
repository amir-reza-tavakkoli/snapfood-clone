import { useLoaderData } from "@remix-run/react"
import { LoaderArgs } from "@remix-run/server-runtime"

import { getUserByPhone } from "~/utils/query.server"
import { requirePhoneNumber } from "~/utils/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  const phoneNumber = await requirePhoneNumber(request)

  try {
    const user = await getUserByPhone({ phoneNumber })

    if (!user) {
      throw new Error("No Such User")
    }

    return { user }
  } catch (error) {
    throw error
  }
}

export default function UserInfo() {
  const data = useLoaderData<typeof loader>()

  return <p>{data.user?.createdAt}</p>
}
