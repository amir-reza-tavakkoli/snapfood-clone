import { User } from "@prisma/client"
import { Link } from "@remix-run/react"
import { DEFAULT_CURRENCY } from "~/constants"
import { Icon } from "./icon"

type UserMenuProps = {
  user: User
}

export const UserMenu = ({ user }: UserMenuProps) => {
  return (
    <dialog open>
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
