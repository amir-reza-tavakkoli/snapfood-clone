import { Form, Link } from "@remix-run/react"

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
    item ? <dl className="item-card">
      <dt className="nonvisual">Image</dt>

      <dd>
        <img
          width={40}
          height={40}
          src={item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
          alt=""
          loading="lazy"
          role="presentation"
        />
      </dd>

      <div>
        <dt className="nonvisual">Name</dt>

        <dd className="_name">{item.name}</dd>

        <dt className="nonvisual">Description</dt>

        <dd className="_description">{item.description}</dd>

        <dt className="nonvisual">Price</dt>

        <dd className="_price">
          {item.price?.toLocaleString("fa") + DEFAULT_CURRENCY}
        </dd>

        {store ? <Link
          type="submit"
          className="button"
          data-variant="primary"
          to={routes.store(store.id)}
        >
          افزودن
        </Link> : null}
      </div>
    </dl> : null
  )
}
