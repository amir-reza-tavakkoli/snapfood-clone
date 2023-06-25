import { Order, Store, User } from "@prisma/client"
import { json } from "@remix-run/node"
import { ALLOWED_PHONE_PREFIX } from "~/constants"
import { FullOrderItem } from "./order.query.server"

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 })

export function toPersianDay(day: number) {
  switch (day) {
    case 0:
      return "یکشنبه"

    case 1:
      return "دوشنبه"

    case 2:
      return "سه شنبه"

    case 3:
      return "چهارشنبه"

    case 4:
      return "پنج شنبه"

    case 5:
      return "جمعه"

    default:
      return "شنبه"
  }
}

export function validatePhoneNumber(phoneNumber: string) {
  if (
    phoneNumber?.length != 11 ||
    !phoneNumber.match(/\d{11}/) ||
    !Boolean(parseInt(phoneNumber)) ||
    !phoneNumber.startsWith(ALLOWED_PHONE_PREFIX)
  ) {
    return "شماره تلفن اشتباه است Format"
  }
}

export function generateVerificationCode(figures: number) {
  const mins = [1]
  const maxs = [9]

  for (let index = 0; index < figures - 1; index++) {
    mins.push(0)
    maxs.push(9)
  }

  let min = Number(mins.join(""))
  let max = Number(maxs.join(""))

  min = Math.ceil(min)
  max = Math.floor(max)

  return String(Math.floor(Math.random() * (max - min) + min))
}

export function generateVerificationExpiry(mins: number): Date {
  const defaultMinutes = 4
  mins = mins ?? defaultMinutes

  return new Date(
    new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + mins),
  )
}

export function validateUrl(url: string, urls: string[]) {
  if (urls.includes(url)) {
    return url
  }
  return "/"
}

// function linksHierarchy() {
//   const location = useLocation().pathname
//   const splits = location.split("/")
//   const hierarchy: string[] = []

//   splits.forEach(split => {
//     if (
//       split === "home" ||
//       split === "stores" ||
//       split === "orders" ||
//       split === "orders-summary" ||
//       split === "cart" ||
//       split === "bill"
//     ) {
//       hierarchy.push(split)
//     }
//   })

//   // console.log(hierarchy)

//   return hierarchy
// }

export function categorizeItems({ items }: { items: FullOrderItem[] }) {
  const itemsInCategory = new Map<string, FullOrderItem[]>()

  items.forEach(item => {
    if (itemsInCategory.has(item.itemCategoryName)) {
      itemsInCategory.get(item.itemCategoryName)?.push(item)
      return
    }

    itemsInCategory.set(item.itemCategoryName, [])
    itemsInCategory.get(item.itemCategoryName)?.push(item)
  })

  const categorizedItems = Array.from(itemsInCategory, ([name, value]) => ({
    name,
    value,
  }))

  return categorizedItems
}

export function validateUser({ user }: { user: User | null }) {
  if (!user || user.isSuspended) {
    throw new Error("کاربر مسدود است")
  }

  if (!user.isVerified) {
    throw new Error("کاربر تایید نشده است")
  }

  return user
}

export function validateItems({ items }: { items: (FullOrderItem | undefined)[] | null }) {
  if (!items || items.length == 0) {
    throw new Error("آیتمی وجود ندارد")
  }

  return items
}

export function validateOrder({
  order,
  phoneNumber,
}: {
  order: Order | null
  phoneNumber: string
}): Order {
  if (!order) {
    throw new Error("چنین سفارشی وجود ندارد")
  }

  if (order.userPhoneNumber !== phoneNumber) {
    throw new Error("اجازه ندارید")
  }

  return order
}

export function validateStore({ store }: { store: Store | null }): Store {
  if (!store || !store.isAvailible) {
    throw new Error("فروشگاه مسدود است")
  }

  if (store.isVerified) {
    return store
  }

  throw new Error("فروشگاه وجود ندارد")
}

export function validateNumberParam(param: number) {
  if (!param || isNaN(param)) {
    throw new Error("خطا")
  }

  return param
}
