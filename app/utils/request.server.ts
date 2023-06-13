import { json } from "@remix-run/node"
import { ALLOWED_PHONE_PREFIX } from "~/routes/login"

/**
 * This helper function helps us to return the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const badRequest = <T>(data: T) => json<T>(data, { status: 400 })

export function validatePhoneNumber(phoneNumber: string) {
  if (
    phoneNumber?.length != 11 ||
    !phoneNumber.match(/\d{11}/) ||
    !Boolean(parseInt(phoneNumber)) ||
    !phoneNumber.startsWith(ALLOWED_PHONE_PREFIX)
  ) {
    return "Wrong Phone Number Format"
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
