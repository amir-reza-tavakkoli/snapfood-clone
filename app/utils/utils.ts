import { Address, storeSchedule, User } from "@prisma/client"
import { COOKIE_ADDRESS, COOKIE_City } from "../constants"
// import { toPersianMonth } from "./utils"

export function toPersianDigits(s: string) {
  return s.replace(/\d/g, (d: any) => "۰۱۲۳۴۵۶۷۸۹"[d])
}

export function getFullAddress(address: Address) {
  return (
    "شهر" +
    " " +
    address.cityName +
    ", " +
    toPersianDigits(address.address) +
    ", " +
    "واحد" +
    " " +
    address.unit.toLocaleString("fa")
  )
}

export function getFormattedDate(date: Date) {
  const x = date.toLocaleDateString("fa").split("/")

  const p2e = (s: any) =>
    s.replace(/[۰-۹]/g, (d: any) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))

  return x[0] + toPersianMonth(Number(p2e(x[1]))) + x[2]
}

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

export function toPersianMonth(month: number) {
  month--
  switch (month) {
    case 0:
      return "فروردین"

    case 1:
      return "اردیبهشت"

    case 2:
      return "خرداد"

    case 3:
      return "تیر"

    case 4:
      return "مرداد"

    case 5:
      return "شهریور"

    case 6:
      return "مهر"

    case 7:
      return "آبان"

    case 8:
      return "آذر"

    case 9:
      return "دی"

    case 10:
      return "بهمن"

    default:
      return "اسفند"
  }
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

export function replaceAll(string: string, replace: string) {
  const regex = new RegExp(`/${replace}/g`)

  return string.replace(regex, "")
}

export function setChosenAddress({
  addressId,
  setAddressId,
  address,
  cityName,
  setHomeAddressState,
}: {
  addressId: number
  setAddressId: React.Dispatch<React.SetStateAction<number>>
  address?: Address
  cityName: string
  setHomeAddressState: any
}) {
  console.log("ppp", address)

  try {
    if (!address) {
      throw new Error("eeee")
    }
    localStorage.setItem(COOKIE_ADDRESS, addressId.toString())
    localStorage.setItem(COOKIE_City, cityName.toString())
    setHomeAddressState(address)
    setAddressId(addressId)
  } catch (error) {
    throw error
  }
}

export function getStoreCurrentSchedule(
  schedules: storeSchedule[],
): storeSchedule | undefined {
  const today = new Date(Date.now())
  const todaySchedule = schedules.filter(s => s.dayNumber === today.getDay())
  const isOpen = todaySchedule.find(
    s => s.startTime < today.getHours() && s.endTime > today.getHours(),
  )

  return isOpen
}

export function getFullName(user: User) {
  return (
    (user.gender ? "خانوم" : "آقای") +
    " " +
    user.firstName +
    "   " +
    user.lastName
  )
}
