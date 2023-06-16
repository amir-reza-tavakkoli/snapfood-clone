import { Store } from "@prisma/client"
import { Link } from "@remix-run/react"
import { Icon } from "./icon"
import { VendorCard } from "./store-card"

const DEFAULT_CURRENCY = "تومان"
const DEFAULT_DELIVERY_METHOD ="ارسال اکسپرس"

type StoreContainerProps = {
  stores?: Store[] | null
  moreHref?: string
  title: string
}

export function StoreContainer({
  stores,
  moreHref,
  title,
}: StoreContainerProps) {

return stores && stores.length > 0 ? (
  <ul className="store-container" aria-label="Stores">
    <div>
      <p>{title}</p>
      {moreHref ? (
        <Link to={moreHref}>مشاهده همه{<Icon name="flash" color="action"></Icon>} </Link>
      ) : undefined}
    </div>
    <div>
      {stores &&
        stores.map((store, index) => (
          <Link to={`home/store/${store.id}`} key={index}>
            <li>
              <VendorCard
                image={store.avatarUrl ?? ""}
                name={store.name}
                type={store.storeKindName}
                ratingValue="4.3"
                ratingCount={320}
                dir="rtl"
                tags={["فست فود"]}
                deliveryMethod={DEFAULT_DELIVERY_METHOD}
                deliveryCurrency={DEFAULT_CURRENCY}
                deliveryPrice={store.shipmentPrice ?? undefined}
                logo="https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/634bff2c452e0.jpg"
              ></VendorCard>
            </li>
          </Link>
        ))}
    </div>
  </ul>
) : null

}
