import { Link } from "@remix-run/react"

import { Icon } from "./icon"
import { VendorCard } from "./store-card"

import { routes } from "../routes"

import {
  DEFAULT_CURRENCY,
  DEFAULT_DELIVERY_METHOD,
  DEFAULT_IMG_PLACEHOLDER,
  type StoreWithTags,
} from "../constants"

type StoreContainerProps = {
  stores?: StoreWithTags[] | null
  moreHref?: string
  title: string
  dir?: "rtl" | "lrt"
}

export function StoreContainer({
  stores,
  moreHref,
  title,
  dir,
}: StoreContainerProps) {
  return stores && stores.length > 0 ? (
    <ul className="store-container" aria-label="Stores" dir={dir}>
      <div>
        { title ? <p>{title}</p> : null}

        {moreHref ? (
          <Link to={moreHref}>
            مشاهده همه{<Icon name="flash" color="action"></Icon>}
          </Link>
        ) : null}
      </div>

      <div>
        {stores &&
          stores.map((store, index) => (
            <Link to={routes.store(store.id)} key={index}>
              <li>
                <VendorCard
                  image={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                  name={store.name}
                  type={store.storeKindName}
                  ratingValue={store.score}
                  ratingCount={store.scoreCount}
                  dir="rtl"
                  tags={store.tags ?? []}
                  deliveryMethod={DEFAULT_DELIVERY_METHOD}
                  deliveryPrice={store.baseShipmentPrice ?? 0}
                  logo="https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/634bff2c452e0.jpg"
                ></VendorCard>
              </li>
            </Link>
          ))}
      </div>
    </ul>
  ) : null
}
