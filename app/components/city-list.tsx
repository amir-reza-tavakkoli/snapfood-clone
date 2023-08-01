import { Link } from "@remix-run/react"

type CityListProps = {
  title: string
  type?: string
  items: {
    name: string
    href?: string
  }[]
  dir?: "lrt" | "rtl"
}

export const CityList = ({
  title,
  type = "City",
  items,
  dir,
}: CityListProps) => {
  return (
    <article className="city-list" dir={dir}>
      <h1>{title}</h1>

      <ul aria-label={type ?? undefined}>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? <Link to={item.href}>{item.name}</Link> : item.name}
          </li>
        ))}
      </ul>
    </article>
  )
}
