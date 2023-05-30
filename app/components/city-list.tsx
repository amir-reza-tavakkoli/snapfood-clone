import "./city-list.css"

type CityListProps = {
  title: string
  type: string
  items: {
    name: string
    href?: string
  }[]
}

export const CityList = ({ title, type, items }: CityListProps) => {
  return (
    <article className="city-list">
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
