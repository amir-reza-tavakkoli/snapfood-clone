import { Icon } from "./icon"
import { Button } from "./button"
import "./header.css"

type HeaderProps = {
  address: string
  about: string
}

export const Header = ({ about, address }: HeaderProps) => {
  return (
    <header className="header">
      <a href="wwww.snappfood.ir" aria-label="Home">
        <Icon name="snappfood" role="presentation" />
        <span className="nonvisual">Snappfood</span>
      </a>
      <div className="_identity">
        <Icon name="navigation" role="presentation"></Icon>
        <p aria-label="Address">{address}</p>
        <Button
          variant="primary"
          icon={{ name: "flash", color: "accent" }}
          type="button"
        >
          <span className="nonvisual">Change</span>
        </Button>
      </div>
      <form name="search">
        <label htmlFor="_search" className="_search">
          <span className="nonvisual">Search {about}</span>
          <input
            autoComplete="on"
            type="search"
            name="search"
            id="_search"
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
        <Button
          variant="primary"
          icon={{ name: "user", color: "text" }}
          type="button"
          aria-label="Account"
        >
          <span className="nonvisual">User</span>
        </Button>
        <Button
          variant="primary"
          icon={{ name: "order", color: "text" }}
          type="button"
        >
          سفارش
        </Button>
      </span>
    </header>
  )
}
