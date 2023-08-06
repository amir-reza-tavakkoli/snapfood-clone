import { Link } from "@remix-run/react"

import { routes } from "../routes"

import { Icon } from "./icon"

export function OwnerBanner() {
  return (
    <article className="owner-banner">
      <div aria-label="About">
        <h1>صاحب کسب و کار هستید؟</h1>

        <p>با اسنپ فود کسب و کارتان را آنلاین کنید و فروشتان را افزایش دهید.</p>

        <Link to={routes.notImplemented}>
          <Icon name="gift"></Icon>
          ثبت نام فروشندگان
        </Link>
      </div>

      <img
        src="https://snappfood.ir/static/images/vendor_pic.png"
        alt=""
        loading="lazy"
        role="presentation"
      />
    </article>
  )
}
