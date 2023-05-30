import "./bread-crumbs.css"
import { Icon } from "./icon"

type Item = {
  name: string
  href: string
}

type BreadCrumbsProps = {
  items: Item[]
}

export const BreadCrumbs = ({ items }: BreadCrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="bread-crumbs">
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.name}
            </a>
            {index !== items.length - 1 ? (
              <Icon name="flash" color="faded" role="presentation" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
