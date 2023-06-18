export type item = {
  name: string
  avatarUrl?: string
  href: string
}

type VendorNavProps = {
  type?: string
  items: item[]
  dir?: "lrt" | "rtl"
}

export const CategoryNav = ({ items, type, dir }: VendorNavProps) => {
  return (
    <nav className="nav" dir={dir}>
      <ul aria-label={type}>
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href}>
              <span>
                {item.avatarUrl ? (
                  <img role="presentation" src={item.avatarUrl} alt="" />
                ) : null}
                <span className="_name">{item.name}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
