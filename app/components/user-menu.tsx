import { Link } from "@remix-run/react"

import type { User } from "@prisma/client"

import { Icon } from "./icon"
import { DEFAULT_CURRENCY } from "~/constants"

type UserMenuProps = {
  user: User
  dir?: "rtl" | "lrt"
  isShowing: boolean
}

export const UserMenu = ({ user, dir, isShowing }: UserMenuProps) => {

  return (
    <nav className={isShowing ? "user-menu" : "nonvisual"} dir={dir}>
      <ul>
        <li>
          <Link to="/userInfo" tabIndex={isShowing ? undefined : -1}>
            <Icon name="user" color="text"></Icon>

            <span className="_user">
              <p className="nonvisual">Name</p>
              <span>{user.firstName + "   " + user.lastName}</span>
              <span>مشاهده حساب کاربری</span>
            </span>
          </Link>
        </li>

        <li>
          <Link to="/wallet" tabIndex={isShowing ? undefined : -1}>
            <Icon name="coupon" color="text"></Icon>

            <span aria-label="Wallet">کیف پول</span>

            <span>
              {user.credit.toLocaleString("fa") + "  " + DEFAULT_CURRENCY}
            </span>
          </Link>
        </li>

        <li>
          <Link to="/reffer" tabIndex={isShowing ? undefined : -1}>
            <Icon name="gift" color="text"></Icon>

            <p className="nonvisual">Reffer</p>
            <span> دعوت از دوستان</span>
          </Link>
        </li>

        <li>

          <form
            aria-label="Logout"
            action="/logout"
            method="post"
            tabIndex={isShowing ? undefined : -1}
          >
          <Icon name="exit" color="text"></Icon>
            <button type="submit" tabIndex={isShowing ? undefined : -1}>
              خروج
            </button>
          </form>
        </li>
      </ul>
    </nav>
  )
}
