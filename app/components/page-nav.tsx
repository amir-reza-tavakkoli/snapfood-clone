import { Link, useLocation } from "@remix-run/react"

import { routes } from "../routes"

import { Icon } from "./icon"

export function PageNav() {
  const location = useLocation()

  return (
    <nav className="page-nav">
      <ul>
        <p className="nonvisual">Links</p>

        <li>
          <Link
            to={routes.index}
            className={
              location.pathname === routes.index ||
              location.pathname === routes.stores ||
              location.pathname.match(routes.stores)
                ? "_choosed"
                : undefined
            }
          >
            <span>خانه</span>

            <Icon name="home"></Icon>
          </Link>
        </li>

        <li>
          <Link
            to={routes.orders}
            className={
              location.pathname === routes.orders ? "_choosed" : undefined
            }
          >
            <span>سفارش ها</span>

            <Icon name="order"></Icon>
          </Link>
        </li>

        <li>
          <Link
            to={routes.cart}
            className={
              location.pathname === routes.cart ? "_choosed" : undefined
            }
          >
            <span>سبد خرید</span>

            <Icon name="cart"></Icon>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
