// These functions are not yet compelete

import { User } from "@prisma/client"
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  MIN_EMAIL_LENGTH,
  MIN_NAME_LENGTH,
} from "~/constants"

export function evaluateComment({ description }: { description: string }) {
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
    if (
      firstName &&
      (firstName.length > MAX_NAME_LENGTH || firstName.length < MIN_NAME_LENGTH)
    ) {
      throw new Error("طول اسم صحیح نیست")
    }

    if (
      lastName &&
      (lastName.length > MAX_NAME_LENGTH || lastName.length < MIN_NAME_LENGTH)
    ) {
      throw new Error("طول اسم صحیح نیست")
    }

    if (
      email &&
      (email.length > MAX_EMAIL_LENGTH ||
        email.length < MIN_EMAIL_LENGTH ||
        !email.indexOf("@"))
    ) {
      throw new Error("فرمت ایمیل صحیح نیست")
    }

    return true
  } catch (error) {}
}

export function evaluateItem({
  description,
  name,
}: {
  description?: string
  name: string
}) {
  try {
    // need to be implemented
    return true
  } catch (error) {}
}

export function evaluateAddress({
  address,
}: {
  address: string | null | undefined
}) {
  try {
    // need to be implemented
    return true
  } catch (error) {}
}
export function evaluateStore({ name }: { name: string | undefined }) {
  try {
    // need to be implemented
    return true
  } catch (error) {}
}
export function evaluateStoreHasItem({
  description,
}: {
  description: string | null | undefined
}) {
  try {
    // need to be implemented
    return true
  } catch (error) {}
}
