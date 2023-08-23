import { Link } from "@remix-run/react"

import type { User } from "@prisma/client"

import { Icon } from "./icon"

import { routes } from "../routes"

import { getFullName, isUnAuthenticated } from "../utils/utils"

import { DEFAULT_CURRENCY } from "../constants"

type UserMenuProps = {
  user: User
  dir?: "rtl" | "lrt"
  isShowing: boolean
  setShowing: React.Dispatch<React.SetStateAction<boolean>>
}

export const UserMenu = ({
  user,
  dir,
  isShowing,
  setShowing,
}: UserMenuProps) => {
  return (
    user ? <nav className={isShowing ? "user-menu" : "nonvisual"} dir={dir}>
      <ul>
        <li onClick={() => setShowing(false)}>
          <Link to={routes.userInfo} tabIndex={isShowing ? undefined : -1}>
            <Icon name="user" color="text"></Icon>

            <span className="_user" aria-label="Name">
              <span>
                {!isUnAuthenticated(user.phoneNumber)
                  ? "کاربر"
                  : getFullName(user)}
              </span>

              <span>مشاهده حساب کاربری</span>
            </span>
          </Link>

          <button
            onClick={() => {
              setShowing(prev => !prev)
            }}
            className="_close-popup"
            role="presentation"
          >
            <Icon name="multiply"></Icon>
          </button>
        </li>

        <li onClick={() => setShowing(false)}>
          <Link to={routes.wallet} tabIndex={isShowing ? undefined : -1}>
            <Icon name="coupon" color="text"></Icon>

            <span aria-label="Wallet">کیف پول</span>

            <span className="_credit">
              {user.credit.toLocaleString("fa") + "  " + DEFAULT_CURRENCY}
            </span>
          </Link>
        </li>

        <li onClick={() => setShowing(false)}>
          <Link
            to={routes.notImplemented}
            tabIndex={isShowing ? undefined : -1}
          >
            <Icon name="gift" color="text"></Icon>

            <span aria-label="Reffer"> دعوت از دوستان</span>
          </Link>
        </li>

        <li onClick={() => setShowing(false)}>
          <form
            aria-label="Logout"
            action={routes.logout}
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
    </nav> : null
  )
}
