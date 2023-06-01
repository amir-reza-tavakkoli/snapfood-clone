import { Link, useLoaderData } from "@remix-run/react"
import { json, LoaderArgs } from "@remix-run/server-runtime"
import { db } from "~/utils/db.server"
import { getPhoneNumber, getUser } from "~/utils/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  //   const jokeListItems = await db.user.findUnique({
  //     orderBy: { createdAt: "desc" },
  //     select: { id: true, name: true },
  //     take: 5,
  //   })

  const user = await getUser(request)
  console.log(user, "kos")

  return json({ user: user })
}

export default function Home() {
  const data = useLoaderData<typeof loader>()

  return (
    <>
      <p>homeeeeee</p>
      {data.user ? (
        <div className="user-info">
          gfgfgfg
          <span>{`Hi ${data.user?.phoneNumber}`}</span>
          <form action="/logout" method="post">
            <button type="submit" className="button">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </>
  )
}
