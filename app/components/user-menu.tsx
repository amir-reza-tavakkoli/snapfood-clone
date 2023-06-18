import { Link } from "@remix-run/react"

import type { User } from "@prisma/client"

import { Icon } from "./icon"
import { DEFAULT_CURRENCY } from "~/constants"

type UserMenuProps = {
  user: User
  dir?: "rtl" | "lrt"
}

export const UserMenu = ({ user,dir }: UserMenuProps) => {
  return (
    <dialog open dir={dir}>
      <nav className="user-menu">
        <ul>
          <li>
            <Link to="i">
              <Icon name="user" color="text"></Icon>
              <span className="_user">
                <span>{user.firstName + " " + user.lastName}</span>
                <span>مشاهده حساب کاربری</span>
              </span>
            </Link>
          </li>

          <li>
            <Link to="i">
              <Icon name="coupon" color="text"></Icon>

              <span>کیف پول</span>
              <span>{user.credit.toLocaleString("fa") + DEFAULT_CURRENCY}</span>
            </Link>
          </li>
          <li>
            <Icon name="gift" color="text"></Icon>

            <Link to="i">دعوت از دوستان</Link>
          </li>
          <li>
            <Icon name="exit" color="text"></Icon>

            <Link to="/logout"> خروج </Link>
          </li>
        </ul>
      </nav>
    </dialog>
  )
}
