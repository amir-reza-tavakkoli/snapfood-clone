import { Link, useLoaderData } from "@remix-run/react"

import type { LoaderArgs } from "@remix-run/node"
import type { User } from "@prisma/client"

import { getUser } from "~/utils/session.server"

export const loader = async ({ request }: LoaderArgs): Promise<User | null> => {
  try {
    const user = await getUser(request)

    return user
  } catch (error) {
    throw error
  }
}

export default function Index() {
  const user = useLoaderData<typeof loader>()

  return (
    <div>
      {user ? <Link to="home">Home</Link> : <Link to="login">Login</Link>}
    </div>
  )
}
