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
      <p>{title}</p>
      <ul aria-label={type ?? undefined}>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? <a href={item.href}>{item.name}</a> : item.name}
          </li>
        ))}
      </ul>
    </article>
  )
}
