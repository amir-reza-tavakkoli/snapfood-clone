import { Link } from "@remix-run/react"

import { Icon } from "./icon"
import { Button } from "./button"

import { routes } from "~/routes"

import type { Address } from "@prisma/client"

import { getFullAddress } from "~/utils/utils"

import { VENDOR_NAME, VENDOR_NAME_ENG } from "~/constants"

type HeaderProps = {
  address?: Address | null
  about?: string
  dir?: "rtl" | "lrt"
  toggleMenu?: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = ({
  about = VENDOR_NAME,
  address,
  dir,
  toggleMenu,
}: HeaderProps) => {
  return (
    <header className="header" dir={dir}>
      <h1 className="nonvisual">{VENDOR_NAME}</h1>

      <a href={routes.index} aria-label="Home" className="_vendor">
        <Icon name={VENDOR_NAME_ENG} role="presentation" />
      </a>

      <div className="_identity">
        <Icon name="navigation" role="presentation"></Icon>

        <Link aria-label="Address" to={routes.addresses}>
          {address ? getFullAddress(address) : "آدرس را انتخاب کنید"}
        </Link>

        <Icon name="flash" color="accent" className="_arrow"></Icon>
      </div>

      <form name="search" className="_search_stores">
        <label htmlFor="__search" className="_search">
          <span className="nonvisual">Search {about}</span>

          <input
            autoComplete="on"
            type="search"
            name="search"
            id="__search"
            placeholder="جست و جو در رستوران ها"
          />
        </label>

        <Button
          type="submit"
          className="_submit"
          icon={{ name: "search", color: "faded" }}
        >
          <span className="nonvisual">Submit</span>
        </Button>

        <Button
          className="_backup-button"
          type="button"
          icon={{ name: "search", color: "faded" }}
          role="presentation"
        >
          <span className="nonvisual">Search</span>
        </Button>

        <div role="presentation"></div>
      </form>

      <span className="_buttons">
        <Button
          variant="primary"
          icon={{ name: "user", color: "text" }}
          type="button"
          aria-label="Account"
          onClick={() => (toggleMenu ? toggleMenu(prev => !prev) : null)}
        >
          <span className="nonvisual">User</span>
        </Button>

        <Button variant="primary" type="button" dir={dir} className="_orders">
          <Icon name="order"></Icon>

          <Link to={routes.orders}> سفارش ها</Link>
        </Button>
      </span>
    </header>
  )
}
