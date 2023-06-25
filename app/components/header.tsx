import { Link } from "@remix-run/react"

import { Icon } from "./icon"
import { Button } from "./button"

type HeaderProps = {
  address: string
  about?: string
  dir?: "rtl" | "lrt"
  x?: React.Dispatch<React.SetStateAction<{ z: number }>>
}

export const Header = ({
  about = "SnappFood",
  address,
  dir,
  x,
}: HeaderProps) => {
  return (
    <header className="header" dir={dir}>
      <a href="/" aria-label="Home">
        <Icon name="snappfood" role="presentation" />
        <span className="nonvisual">Snappfood</span>
      </a>
      <div className="_identity">
        <Icon name="navigation" role="presentation"></Icon>
        <Link
          aria-label="Address"
          to={"/addresses"}
          onClick={() => (x ? x({ z: 7 }) : undefined)}
        >
          {address}
        </Link>
        <Button
          variant="primary"
          icon={{ name: "flash", color: "accent" }}
          type="button"
        >
          <span className="nonvisual">Change</span>
        </Button>
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
        >
          <span className="nonvisual">Search</span>
        </Button>
        <div></div>
      </form>
      <span className="_buttons">
        <Link to={"/home/user-info"}>
          <Button
            variant="primary"
            icon={{ name: "user", color: "text" }}
            type="button"
            aria-label="Account"
          >
            <span className="nonvisual">User</span>
          </Button>
        </Link>
        <Button
          variant="primary"
          // icon={{ name: "order", color: "text" }}
          type="button"
          dir={dir}
        >
          <Icon name="order"></Icon>
          <Link to={"/home/orders"}> سفارش ها</Link>
        </Button>
      </span>
    </header>
  )
}
