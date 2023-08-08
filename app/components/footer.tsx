import type { ComponentProps } from "react"

import { routes } from "../routes"

import { Icon } from "./icon"

import { Link } from "@remix-run/react"

import { VENDOR_NAME, VENDOR_NAME_ENG } from "../constants"

type Reference = {
  name?: string
  href: string
}

type WithImage = Reference & { logo: string }

type WithIcon = Reference & { logo: ComponentProps<typeof Icon> }

type FooterProps = {
  name?: string
  logo?: ComponentProps<typeof Icon>
  homepage?: string
  description?: string
  links?: Reference[]
  contacts?: WithIcon[]
  credentials?: WithImage[]
  dir?: "rtl" | "lrt"
}

export const Footer = ({
  logo = { name: VENDOR_NAME_ENG },
  name = VENDOR_NAME,
  homepage = routes.index,
  description = "تجربه سفارش غذا، از زودفود تا اسنپ‌ فود",
  links = [
    { name: "درباره اسنپ فود", href: routes.about },
    { name: "وبلاگ", href: routes.notImplemented },
    { name: "قوانین سایت", href: routes.notImplemented },
    { name: "حریم شخصی", href: routes.notImplemented },
    { name: "ثبت نام فروشندگان", href: routes.notImplemented },
    { name: "تماس با اسنپ فود", href: routes.notImplemented },
    { name: "ٍثبت شکایات", href: routes.notImplemented },
    { name: "پرسش های متداول", href: routes.notImplemented },
  ],
  credentials = [
    {
      name: "E-Trust",
      href: routes.notImplemented,
      logo: "https://snappfood.ir/static/images/senf.png",
    },
    {
      name: "E-Namad",
      href: routes.notImplemented,
      logo: "https://snappfood.ir/static/images/senf.png",
    },
  ],
  contacts = [
    { href: routes.notImplemented, logo: { name: "twitter" } },
    { href: routes.notImplemented, logo: { name: "telegram" } },
    { href: routes.notImplemented, logo: { name: "linkedin" } },
    { href: routes.notImplemented, logo: { name: "instagram" } },
    { href: routes.notImplemented, logo: { name: "aparat" } },
  ],
  dir,
}: FooterProps) => {
  return (
    <footer className="footer" dir={dir}>
      <h1 className="nonvisual">{name}</h1>

      <div>
        <address className="_vendor">
          <Link to={homepage} aria-label="Homepage" rel="canonical">
            <Icon name={logo.name} role="presentation" />
          </Link>

          <span>
            <span>{name}</span>

            <span>{description}</span>
          </span>
        </address>

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
            <Link to={item.href}>{item.name}</Link>
          </li>
        ))}
      </ul>

      <ul className="_credentials" aria-label="Credentials">
        {credentials.map((item, index) => (
          <li key={index}>
            <a href={item.href} rel="external license" aria-label={item.name}>
              <img
                src={item.logo}
                role="presentation"
                alt=""
                loading="lazy"
                width={40}
                height={40}
              />
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
