import { StoreKind } from "@prisma/client"
import { Link } from "@remix-run/react"
import { DEAFULT_DIRECTION, VENDOR_NAME_ENG } from "~/constants"
import { routes } from "~/routes"
import { Icon } from "./icon"
import { CategoryNav } from "./nav"

type IntroBannerProps = {
    city: string
    storesKind : StoreKind[]
}

export function IntroBanner({storesKind, city = ""} : IntroBannerProps ) {
  return (
    <header className="intro-banner">
      <div>
        <Icon name={VENDOR_NAME_ENG}></Icon>
        <Link to={routes.notImplemented}>ثبت نام فروشندگان</Link>
        <Link to={routes.login}> ورود یا عضویت</Link>
      </div>
      <div>
        <h1>سفارش آنلاین</h1>
              <p>سفارش آنلاین غذا ، میوه، نان، شیرینی و ...</p>
              <img src="https://snappfood.ir/static/images/hero-image.png" alt="" />
      </div>
      <CategoryNav
        dir={DEAFULT_DIRECTION}
        type="Categories"
        items={storesKind.map(kind => {
          return {
            name: kind.name,
            avatarUrl: kind.avatarUrl,
            href: `/stores/${city}/kind/${kind.name}`,
          }
        })}
      ></CategoryNav>
    </header>
  )
}
