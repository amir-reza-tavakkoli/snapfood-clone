import type { ComponentProps } from "react"
import { CityList } from "./city-list"

const props: ComponentProps<typeof CityList> = {
  title: "اسنپ‌فود در شهرهای ایران",
  type: "شهر",
  items: [
    { name: "شیراز", href: "#" },
    { name: "تهران", href: "#" },
    { name: "بندر عباس", href: "#" },
    { name: "شهرکرد", href: "#" },
    { name: "آباده", href: "#" },
    { name: "قزوین", href: "#" },
    { name: "ساری", href: "#" },
    { name: "کرمان", href: "#" },
    { name: "عباس شهر", href: "#" },
    { name: "مشهد", href: "#" },
    { name: "بیرجند", href: "#" },
    { name: "شیراز", href: "#" },
    { name: "تهران", href: "#" },
    { name: "بندر عباس", href: "#" },
    { name: "شهرکرد", href: "#" },
    { name: "آباده", href: "#" },
    { name: "قزوین", href: "#" },
    { name: "ساری", href: "#" },
    { name: "کرمان", href: "#" },
    { name: "عباس شهر", href: "#" },
    { name: "مشهد", href: "#" },
    { name: "بیرجند", href: "#" },
  ],
}

export const CityListDefault = () => {
  return <CityList {...props}></CityList>
}

export const OverflowingText = () => {
  const items = props.items.map(item => {
    return { ...item, name: item.name.repeat(5) }
  })
  const newProps = { ...props, items }
  return <CityList {...newProps}></CityList>
}
