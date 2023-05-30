import type { ComponentProps } from "react"
import "./footer.css"
import { Icon } from "./icon"

type Reference = {
  name?: string
  href: string
}

type WithImage = Reference & { logo: string }
type WithIcon = Reference & { logo: ComponentProps<typeof Icon> }

type FooterProps = {
  name: string
  logo: ComponentProps<typeof Icon>
  homepage: string
  description?: string
  links: Reference[]
  contacts: WithIcon[]
  credentials: WithImage[]
}

export const Footer = ({
  logo,
  name,
  homepage,
  description,
  links,
  credentials,
  contacts,
}: FooterProps) => {
  return (
    <footer className="footer">
      <div>
        <p className="_vendor">
          <a href={homepage} aria-label="Homepage" rel="canonical">
            <Icon name={logo.name} role="presentation" />
          </a>
          <span>
            <span>{name}</span>
            <span>{description}</span>
          </span>
        </p>

        <address aria-label="Contacts">
          <ul className="_contacts">
            {contacts.map((item, index) => (
              <li key={index}>
                <a href={item.href} rel="external" aria-label={item.logo.name}>
                  <Icon
                    name={item.logo.name}
                    color="text"
                    role="presentation"
                  />
                </a>
              </li>
            ))}
          </ul>
        </address>
      </div>

      <ul aria-label="Sitemap" className="_sitemap">
        {links.map((item, index) => (
          <li key={index}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>

      <ul className="_credentials" aria-label="Credentials">
        {credentials.map((item, index) => (
          <li key={index}>
            <a href={item.href} rel="external license" aria-label={item.name}>
              <img src={item.logo} role="presentation" alt="" />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
