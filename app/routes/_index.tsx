import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { getFullOrderItems } from "~/utils/order.query.server"

import { getUser } from "~/utils/session.server"
import { getFullStoreItems } from "~/utils/store.query.server"

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request)
  const u = await getFullStoreItems({ storeId: 1 })
  return { user, u }
}

export default function Index() {
  const { user, u } = useLoaderData<typeof loader>()
  console.log(u)

  return <div></div>
}
