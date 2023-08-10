import type { Address, Order, Store, storeSchedule, User } from "@prisma/client"

import { getOrderStatus } from "../queries.server/db.utils.query"

import {
  BASE_SHIPMENT_MULTIPLIER,
  COOKIE_ADDRESS,
  COOKIE_City,
  JoinedOrderItem,
  PER_UNIT_ADDED_TIME,
  READY_TIME_OFFSET,
  UNAUTH_USER_PHONE,
} from "../constants"

export function toPersianDigits(string: string) {
  return string.replace(/\d/g, (digit: any) => "۰۱۲۳۴۵۶۷۸۹"[digit])
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

function isAddressInRange({
  storeAddress,
  destinationAddress,
  store,
}: {
  storeAddress: Address
  destinationAddress: Address
  store: Store
}) {
  const distance = getDistance({ destinationAddress, storeAddress })

  if (isNaN(distance)) {
    return
  }

  return store.shipmentRadius! > distance * BASE_SHIPMENT_MULTIPLIER
}

function getDistance({
  storeAddress,
  destinationAddress,
}: {
  storeAddress: Address
  destinationAddress: Address
}): number {
  return Number(
    Math.sqrt(
      (storeAddress.xAxis - destinationAddress.xAxis) ** 2 +
        (storeAddress.yAxis - destinationAddress.yAxis) ** 2,
    ).toPrecision(1),
  )
}

export function getFormattedDate(date: Date) {
  if (typeof date !== "object") {
    return
  }

  const persianDate = date.toLocaleDateString("fa").split("/")

  const p2e = (string: any) =>
    string.replace(/[۰-۹]/g, (digit: any) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))

  return (
    persianDate[2] +
    " " +
    toPersianMonth(Number(p2e(persianDate[1]))) +
    " " +
    persianDate[0]
  )
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
  month-- // offset by one

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
  try {
    if (!address) {
      throw new Response("آدرس صحیح نیست", { status: 404 })
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
  const now = new Date(Date.now())

  const todaySchedule = schedules.filter(
    schedule => schedule.dayNumber === now.getDay(),
  )

  const schedule = todaySchedule.find(
    schedule =>
      schedule.startTime <= now.getHours() &&
      schedule.endTime >= now.getHours(),
  )

  return schedule
}

export function getFullName(user: User) {
  return (
    (user.gender ? "خانوم" : "آقای") +
    " " +
    user.firstName +
    "   " +
    (user.lastName ?? "")
  )
}

export function validateOrderPossibility({
  store,
  order,
  address,
  schedules,
  storeAddress,
}: {
  store: Store
  order?: Order
  address: Address | undefined | null
  storeAddress: Address | undefined | null
  schedules: storeSchedule[]
}) {
  if (order && (order.isBilled || order.isCanceled || !order.isInCart)) {
    throw new Error("سفارش قبلا تایید شده است")
  }

  if (!store.isVerified || !store.isAvailible) {
    throw new Error("فروشگاه دردسترس نیست")
  }

  if (!address || store.cityName !== address.cityName) {
    throw new Error("آدرس صحیح نیست")
  }

  if (order && order.totalPrice < store.minOrderPrice) {
    throw new Error("حداقل قیمت صحیح نیست")
  }

  if (!schedules || getStoreCurrentSchedule(schedules)) {
    throw new Error("فروشگاه بسته است")
  }

  if (order && getOrderStatus({ order }).status !== "inCart") {
    throw new Error("مشکلی در دریافت وضعیت سفارش پیش آمد")
  }

  if (
    !storeAddress ||
    !isAddressInRange({ destinationAddress: address, store, storeAddress })
  ) {
    throw new Error("فروشگاه در رنج نیست")
  }

  return true
}

export function validateStorePossibility({
  store,
  address,
  schedules,
  storeAddress,
}: {
  store: Store
  address: Address | undefined
  storeAddress: Address | undefined
  schedules: storeSchedule[]
}) {
  if (!address || store.cityName !== address.cityName) {
    return { reason: "آدرس ها در یک شهر قرار ندارند ", status: 1 }
  }

  if (!schedules || !getStoreCurrentSchedule(schedules)) {
    return { reason: "فروشگاه بسته است", status: 2 }
  }

  if (
    !storeAddress ||
    !isAddressInRange({ destinationAddress: address, store, storeAddress })
  ) {
    return { reason: "فروشگاه در رنج نیست", status: 3 }
  }

  return { status: 0 }
}

// In tooman
export function calculateShipmentTime({
  storeAddress,
  store,
  destinationAddress,
}: {
  storeAddress: Address
  store: Store
  destinationAddress: Address
}) {
  const distance = getDistance({ destinationAddress, storeAddress })

  if (isNaN(distance)) {
    return
  }

  return Number(
    (
      distance * BASE_SHIPMENT_MULTIPLIER * PER_UNIT_ADDED_TIME +
      store.baseShipmentTime
    ).toFixed(),
  )
}

// In mins
export function calculateShipmentPrice({
  storeAddress,
  store,
  destinationAddress,
}: {
  storeAddress: Address
  store: Store
  destinationAddress: Address
}) {
  const distance = getDistance({ destinationAddress, storeAddress })

  if (isNaN(distance)) {
    return
  }

  return (
    distance * BASE_SHIPMENT_MULTIPLIER * store.perUnitShipmentPrice +
    store.baseShipmentPrice
  )
}

export function getRateDescription(rate: number) {
  switch (rate) {
    case 1:
      return "خیلی بد"

    case 2:
      return "نسبتا بد"

    case 3:
      return "معمولی"

    case 4:
      return "خوب"

    case 5:
      return "عالی"

    default:
      return ""
  }
}

export function calculateItemsReadyTime({
  store,
  items,
}: {
  items: JoinedOrderItem[]
  store: Store
}) {
  try {
    let max = 0

    items.forEach(item => {
      if (!item.estimatedReadyTime) {
        return
      }

      max < item.estimatedReadyTime
        ? (max = item.estimatedReadyTime)
        : undefined
    })

    return Number((max + READY_TIME_OFFSET + items.length).toFixed())
  } catch (error) {
    throw error
  }
}

export function getDiffInMinutes(endTime: Date, startTime: Date) {
  let difference = Math.abs(endTime.getTime() - startTime.getTime())
  return Math.round(difference / 60000)
}

export function isUnAuthenticated(phoneNumber: string) {
  return phoneNumber === UNAUTH_USER_PHONE
}
