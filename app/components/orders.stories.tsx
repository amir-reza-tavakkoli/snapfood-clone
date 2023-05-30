import type { ComponentProps } from "react"
import { Orders } from "./orders"

const props: ComponentProps<typeof Orders> = {
  orders: [
    {
      name: "بگ میرزا",
      logo: "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/59fb1a2537df6.jpg",
      date: "پنجشنبه ۳ شهریور",
      time: "۲۰:۱۷",
    },
    {
      name: "بگ میرزا",
      logo: "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/59fb1a2537df6.jpg",
      date: "پنجشنبه ۳ شهریور",
      time: "۲۰:۱۷",
    },
    {
      name: "بگ میرزا",
      logo: "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/59fb1a2537df6.jpg",
      date: "پنجشنبه ۳ شهریور",
      time: "۲۰:۱۷",
    },
    {
      name: "بگ میرزا",
      logo: "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/59fb1a2537df6.jpg",
      date: "پنجشنبه ۳ شهریور",
      time: "۲۰:۱۷",
    },
  ],
}

export const OrdersDefault = () => {
  return <Orders {...props}></Orders>
}
