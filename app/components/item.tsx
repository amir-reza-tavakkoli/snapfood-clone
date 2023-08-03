import { Form } from "@remix-run/react"

import type { Store } from "@prisma/client"

import { Button } from "./button"
import { routes } from "../routes"

import {
  DEFAULT_CURRENCY,
  DEFAULT_IMG_PLACEHOLDER,
  type JoinedOrderItem,
} from "../constants"

type ItemProps = {
  item: JoinedOrderItem
  store: Store
  address: number | undefined
}

export function ItemComp({ item, store, address }: ItemProps) {
  return (
    <dl className="item-card">
      <dt className="nonvisual">Name</dt>

      <dd>{item.name}</dd>

      <dt className="nonvisual">Description</dt>

      <dd className="_description">{item.description}</dd>

      <dt className="nonvisual">Image</dt>

      <dd>
        <img
          src={item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
          alt=""
          role="presentation"
        />
      </dd>

      <dt className="nonvisual">Price</dt>

      <dd className="_price">
        {item.price?.toLocaleString("fa") + DEFAULT_CURRENCY}
      </dd>

      {item.isAvailible ? (
        <>
          <Form
            method="post"
            action={routes.store(store.id)}
            reloadDocument={false}
          >
            {item.count ? item.count.toLocaleString("fa") : null}

            <input type="hidden" name="id" value={item.id} />

            <input type="hidden" name="job" value="add" />

            <input type="hidden" name="address" value={address} />

            <Button
              type="submit"
              disabled={item.remainingCount === 0 || !address}
            >
              +
            </Button>
          </Form>

          <Form method="post" reloadDocument={false}>
            <input type="hidden" name="id" value={item.id} />

            <input type="hidden" name="job" value="remove" />

            <input type="hidden" name="address" value={address} />

            {!item.count ? undefined : <Button type="submit"> - </Button>}
          </Form>
        </>
      ) : null}
    </dl>
  )
}
