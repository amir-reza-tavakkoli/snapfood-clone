import { Item, Order, Store } from "@prisma/client"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react"
import { json, LoaderArgs, LoaderFunction } from "@remix-run/server-runtime"
import { useEffect, useState } from "react"
import { Button } from "~/components/button"
import { DEFAULT_IMG_PLACEHOLDER } from "~/constants"
import { getStoreOrderInCart } from "~/utils/cart.query.server"
import { getItem } from "~/utils/item.query.server"
import { FullOrderItem, getOrder } from "~/utils/order.query.server"
import { requirePhoneNumber } from "~/utils/session.server"
import {
  getFullStoreItems,
  getFullStoreOrdersItems,
  getStore,
  getStoreItems,
} from "~/utils/store.query.server"
import { getUserByPhone } from "~/utils/user.query.server"

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs): Promise<{
  foundItem: FullOrderItem
  store: Store
  order: Order | undefined
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)
    const user = await getUserByPhone({ phoneNumber })

    const itemId = Number(params.itemId)
    const storeId = Number(params.storeId)

    if (!itemId || !storeId) {
      throw new Error("404")
    }

    const item = await getItem({ itemId })

    if (!item) {
      throw new Error("چنین آیتمی وجود ندارد")
    }

    const store = await getStore({ storeId })

    if (!store) {
      throw new Error("فروشگاهی با این مشخصات وجود ندارد")
    }

    let items: any = []

    let order = await getStoreOrderInCart({ storeId: store.id, phoneNumber })

    if (order && !order.isBilled) {
      items = await getFullStoreOrdersItems({
        storeId,
        orderId: order.id,
      })
    } else {
      items = await getFullStoreItems({ storeId })
      order = undefined
    }

    if (!items) {
      throw new Error("No Items There")
    }

    const foundItem = items.find(item => item.id == itemId)

    if (!foundItem) {
      throw new Error("No Items There")
    }

    return { foundItem, store, order }
  } catch (error) {
    throw error
  }
}

export default function ItemInStore() {
  const [render, reRender] = useState({})

  const { foundItem, store }: { foundItem: FullOrderItem; store: Store } =
    useLoaderData<typeof loader>()
  const actionData = useActionData()
  const [item, setItem] = useState(foundItem)

  useEffect(() => {
    if (actionData && actionData.newItems) {
      const newItem: FullOrderItem = actionData.newItems.find(
        (item: FullOrderItem) => item.id === foundItem.id,
      )

      if (actionData && newItem) setItem(newItem)
    }
  }, [actionData])

  const navigate = useNavigate()

  const [address, setAddress] = useState<number>(0)
  useEffect(() => {
    const choosedAddress = localStorage.getItem("addressId")
    if (
      !choosedAddress ||
      isNaN(Number(choosedAddress)) ||
      !Number(choosedAddress)
    ) {
      setTimeout(() => navigate(`/home/addresses?storeId=${store.id}`), 2000)
      setAddress(-1)
    }

    if (Number(choosedAddress) != address) setAddress(Number(choosedAddress))
  }, [render])

  return (
    <dl className="item-card">
      <dt className="nonvisual">Name</dt>
      <dd>{item.name}</dd>
      <dt className="nonvisual">Description</dt>
      <dd className="_description">{item.description}</dd>
      <dt className="nonvisual">Image</dt>
      <dd>
        <img src={item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER} alt="" />
      </dd>
      <dt className="nonvisual">Price</dt>
      <dd className="_price">{item.price}</dd>
      {item.isAvailible ? (
        <>
          <Form method="post" action={`/store/${store.id}`}>
            {item.count ? item.count : null}
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="job" value="add" />
            <input type="hidden" name="address" value={address} />
            <Button
              type="submit"
              disabled={item.remainingCount == 0 || !address}
            >
              +
            </Button>
          </Form>

          <Form method="post">
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="job" value="remove" />
            <input type="hidden" name="address" value={address} />

            {!foundItem.count ? undefined : <Button type="submit"> - </Button>}
          </Form>
        </>
      ) : null}
    </dl>
  )
}
