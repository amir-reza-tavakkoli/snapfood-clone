import { getCities } from "../queries.server/address.query.server"

import type { Order, Store, User } from "@prisma/client"
import type { FullOrderItem } from "../queries.server/order.query.server"

import {
  ALLOWED_PHONE_PREFIX,
  DEFAULT_MIN_ADDRESS_LENGTH,
  VERIFICATION_CODE_EXPIRY_MINS,
  VERIFICATION_CODE_FIGURES,
} from "~/constants"
import {
  generateVerificationCode,
  generateVerificationExpiry,
} from "./utils.server"
import { updateVerificationCode } from "~/queries.server/user.query.server"

export function checkPhoneNumber(phoneNumber: string) {
  if (
    phoneNumber.length != 11 ||
    !phoneNumber.match(/\d{11}/) ||
    !Boolean(parseInt(phoneNumber)) ||
    !phoneNumber.startsWith(ALLOWED_PHONE_PREFIX)
  ) {
    return "شماره تلفن اشتباه است"
  }
}

export function validateUrl(url: string, urls: string[]) {
  if (urls.includes(url)) {
    return url
  }
  return "/"
}

export async function validateAddress({
  address,
  unit,
}: {
  address?: string
  unit?: number
}) {
  if (address && address.length < DEFAULT_MIN_ADDRESS_LENGTH) {
    throw new Response(".طول آدرس کوتاه است.", { status: 422 })
  }

  if (unit && (typeof unit !== "number" || isNaN(unit))) {
    throw new Response(".شماره واحد تعیین نشده است", { status: 404 })
  }

  return { address, unit }
}

export async function validateCity({ cityName }: { cityName: string }) {
  const cities = await getCities()

  if (!cities) {
    throw new Response("مشکلی پیش آمده", { status: 404 })
  }

  if (!cities.find(city => city.name === cityName)) {
    throw new Response("این شهر پشتیبانی نمی شود", { status: 404 })
  }

  return cityName
}

export function validateUser({ user }: { user: User | null }) {
  if (!user) {
    throw new Response("کاربر وجود ندارد.", { status: 404 })
  }

  if (user.isSuspended) {
    throw new Response("کاربر مسدود است", { status: 403 })
  }

  if (!user.isVerified) {
    throw new Response("کاربر تایید نشده است", { status: 401 })
  }

  return user
}

export function validateItems({
  items,
}: {
  items: (FullOrderItem)[] | null
}) {
  if (!items || items.length == 0) {
    throw new Response("آیتمی وجود ندارد", { status: 404 })
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
    throw new Response("چنین سفارشی وجود ندارد", { status: 404 })
  }

  if (order.userPhoneNumber !== phoneNumber) {
    throw new Response("اجازه ندارید", { status: 403 })
  }

  return order
}

export function validateStore({ store }: { store: Store | null }): Store {
  if (!store) {
    throw new Response("فروشگاه ناموجود است", { status: 404 })
  }

  if (!store.isAvailible) {
    throw new Response("فروشگاه خارج از دسترس است", { status: 404 })
  }

  if (store.isVerified) {
    return store
  }

  throw new Response("فروشگاه وجود ندارد", { status: 404 })
}

export function validateNumberParam(param: number) {
  if (!param || isNaN(param)) {
    throw new Response("خطا", { status: 422 })
  }

  return param
}

export async function sendVerification({
  phoneNumber,
}: {
  phoneNumber: string
}) {
  const verificationCode = generateVerificationCode(VERIFICATION_CODE_FIGURES)

  const verificationCodeExpiry = generateVerificationExpiry(
    VERIFICATION_CODE_EXPIRY_MINS,
  )

  const user = await updateVerificationCode(
    phoneNumber,
    verificationCode,
    verificationCodeExpiry,
  )

  if (!user) {
    throw new Error("An error occured")
  }

  // sending ver code by SMS goes here

  return user
}
