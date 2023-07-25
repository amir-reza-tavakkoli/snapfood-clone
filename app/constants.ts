import { Store } from "@prisma/client"

export const VENDOR_NAME = "اسنپ فود"
export const DEFAULT_CURRENCY = "تومان"
export const DEFAULT_DELIVERY_METHOD = "ارسال اکسپرس"
export const DEFAULT_CITY = "تهران"
export const DEFAULT_MIN_ADDRESS_LENGTH = 10
export const DEAFULT_DIRECTION = "rtl"
export const DEFAULT_IMG_PLACEHOLDER =
  "https://snappfood.ir/static/images/placeholder.png"
export const ALLOWED_PHONE_PREFIX = "09"
export const VERIFICATION_CODE_FIGURES = 4
export const VERIFICATION_CODE_EXPIRY_MINS = 5 // mins
export const ALLOWED_URLS = ["/", "/stores", "/orders", "/login", "/addresses"]
export const INDEX_URL = "/"
export const DEFAULT_COORDINATIONS = {
  xAxis: 35.7152,
  yAxis: 51.4043,
} // tehran
export const DEFAULT_MAP_ZOOM = 13
export const DEFAULT_DELIVERY_PRICE = 0
export const DEFAULT_READY_TIME = 15
export const DEFAULT_SHIPMENT_TIME = 15
export const DEFAULT_USER_NAME = "کاربر"
export const DEFAULT_DELIVERY_RADIUS = 10 // in map
export type RESPONDED_BY = "مدیر رستوران" | typeof VENDOR_NAME

export type AllowedStoresFeatures = "kind" | "discount" | "freeShipment" | "all"
export type StoreWithTags = Store & {
  tags?: string[]
}

export const SCORE_ROUNDING = 2
export const READY_TIME_OFFSET = 15

export const COOKIE_ADDRESS = "addressId"