import { Link } from "@remix-run/react"

import type { StoreKind } from "@prisma/client"

import { routes } from "../routes"

import { Icon } from "./icon"
import { CategoryNav } from "./nav"

import { DEAFULT_DIRECTION, VENDOR_NAME_ENG } from "../constants"

type IntroBannerProps = {
  city?: string
  storesKind: StoreKind[]
}

export function IntroBanner({ storesKind, city = "" }: IntroBannerProps) {
  return (
    <main className="intro-banner">
      <div>
        <span>
          <Link to={routes.notImplemented}>
            ثبت نام فروشندگان
            <Icon name="store" color="text" className="_store-owner"></Icon>
          </Link>

          <Link to={routes.login} className="_login">
            {" "}
            ورود یا عضویت
          </Link>
        </span>

        <Link to={routes.index} className="_logo">
          <Icon name={VENDOR_NAME_ENG}></Icon>
        </Link>
      </div>

      <div aria-label="About">
        <h1>سفارش آنلاین </h1>

        <p aria-label="Services">سفارش آنلاین غذا ، میوه، نان، شیرینی و ...</p>
      </div>

      <img
        src="https://snappfood.ir/static/images/hero-image.png"
        alt=""
        loading="lazy"
        width={153}
        height={128}
        role="prsentation"
      />

      {storesKind ? (
        <CategoryNav
          dir={DEAFULT_DIRECTION}
          type="Categories"
          items={storesKind.map(kind => {
            return {
              name: kind.name,
              avatarUrl: kind.avatarUrl,
              href: routes.storesKind(city, kind.name),
            }
          })}
        ></CategoryNav>
      ) : null}
    </main>
  )
}
