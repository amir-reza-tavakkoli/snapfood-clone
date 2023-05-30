import type { ComponentProps } from "react"
import { BreadCrumbs } from "./bread-crumbs"

const props: ComponentProps<typeof BreadCrumbs> = {
  items: [
    {
      name: "Snappfood",
      href: "#",
    },
    {
      name: "Bakeries",
      href: "#",
    },
    {
      name: "Shiraz bakeries",
      href: "#",
    },
  ],
}

export const BreadCrumbsDefault = () => {
  return <BreadCrumbs {...props}></BreadCrumbs>
}
