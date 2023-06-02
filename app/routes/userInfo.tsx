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

  return { user }
}

export default function UserInfo() {
  const data = useLoaderData<typeof loader>()
  return <p>{data.user?.createdAt}</p>
}
