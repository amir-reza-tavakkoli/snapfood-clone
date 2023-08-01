// These functions are not yet compelete

import { checkPhoneNumber } from "../utils/validate.server"

import { Address, Comment, Item, User } from "@prisma/client"
import {
  DEFAULT_MIN_ADDRESS_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MAX_READY_TIME,
  MAX_VALID_DATE_YEAR_ADDED,
  MIN_DESCRIPTION_LENGTH,
  MIN_EMAIL_LENGTH,
  MIN_NAME_LENGTH,
  MIN_READY_TIME,
  MIN_VALID_DATE_YEAR,
} from "../constants"

export function evaluateComment({ description }: Partial<Comment>) {
  try {
    // need to be implemented
    return true
  } catch (error) {}
}

export function evaluateUser({
  firstName,
  birthday,
  email,
  gender,
  lastName,
  phoneNumber,
  credit,
}: Partial<User>) {
  try {
    // need to be implemented
    if (phoneNumber && checkPhoneNumber(phoneNumber)) {
      throw new Response("طول شماره تلفن صحیح نیست", { status: 404 })
    }

    if (
      firstName &&
      (firstName.length > MAX_NAME_LENGTH || firstName.length < MIN_NAME_LENGTH)
    ) {
      throw new Response("طول اسم صحیح نیست", { status: 404 })
    }

    if (
      lastName &&
      (lastName.length > MAX_NAME_LENGTH || lastName.length < MIN_NAME_LENGTH)
    ) {
      throw new Response("طول اسم صحیح نیست", { status: 404 })
    }

    if (
      email &&
      (email.length > MAX_EMAIL_LENGTH ||
        email.length < MIN_EMAIL_LENGTH ||
        !email.indexOf("@"))
    ) {
      throw new Response("فرمت ایمیل صحیح نیست", { status: 404 })
    }

    const newYear = new Date(Date.now()).setFullYear(
      new Date(Date.now()).getFullYear() + MAX_VALID_DATE_YEAR_ADDED,
    )

    if (
      birthday &&
      (birthday.getFullYear() > newYear ||
        birthday.getFullYear() < MIN_VALID_DATE_YEAR)
    ) {
      throw new Response(" تاریخ تولد وارد شده صحیح نیست", { status: 404 })
    }

    if (credit && credit < 0) {
      throw new Response("اعتبار وارد شده صحیح نیست", { status: 404 })
    }

    return true
  } catch (error) {}
}

export function evaluateItem({
  description,
  name,
  basePrice,
  estimatedReadyTime,
}: Partial<Item>) {
  try {
    // need to be implemented
    if (
      description &&
      (description.length < MIN_DESCRIPTION_LENGTH ||
        description.length > MAX_DESCRIPTION_LENGTH)
    ) {
      throw new Response("طول توضیحات صحیح نیست", { status: 404 })
    }

    if (
      name &&
      (name.length < MIN_NAME_LENGTH || name.length > MAX_NAME_LENGTH)
    ) {
      throw new Response("طول اسم صحیح نیست", { status: 404 })
    }

    if (
      estimatedReadyTime &&
      (estimatedReadyTime < MIN_READY_TIME ||
        estimatedReadyTime > MAX_READY_TIME)
    ) {
      throw new Response("زمان آماده سازی صحیح نیست", { status: 404 })
    }

    if (basePrice && basePrice < 0) {
      throw new Response("قیمت صحیح نیست", { status: 404 })
    }

    return true
  } catch (error) {
    throw error
  }
}

export function evaluateAddress({
  address,
  cityName,
  details,
  title,
  unit,
  xAxis,
  yAxis,
  postalCode,
}: Partial<Address>) {
  try {
    if (
      address &&
      (address.length < DEFAULT_MIN_ADDRESS_LENGTH ||
        address.length > MAX_DESCRIPTION_LENGTH)
    ) {
      throw new Response("آدرس وارد شده صحیح نیست", { status: 404 })
    }

    if (
      details &&
      (details.length < MIN_DESCRIPTION_LENGTH ||
        details.length > MAX_DESCRIPTION_LENGTH)
    ) {
      throw new Response("جزییات وارد شده صحیح نیست", { status: 404 })
    }

    if (
      title &&
      (title.length < MIN_DESCRIPTION_LENGTH ||
        title.length > MAX_DESCRIPTION_LENGTH)
    ) {
      throw new Response("عنوان وارد شده صحیح نیست", { status: 404 })
    }

    if (
      postalCode &&
      (postalCode.length < MIN_NAME_LENGTH ||
        postalCode.length > MAX_NAME_LENGTH)
    ) {
      throw new Response("کدپستی وارد شده صحیح نیست", { status: 404 })
    }

    return true
  } catch (error) {}
}
