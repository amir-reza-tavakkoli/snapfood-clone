import { Store } from "@prisma/client"

export const VENDOR_NAME = "اسنپ فود"
export const VENDOR_NAME_ENG = "snappfood"
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
export const DEFAULT_SHIPMENT_PRICE = 0
export const DEFAULT_READY_TIME = 15
export const DEFAULT_SHIPMENT_TIME = 15
export const DEFAULT_USER_NAME = "کاربر"
export const DEFAULT_SHIPMENT_RADIUS = 10 // in map
export type RESPONDED_BY = "مدیر رستوران" | typeof VENDOR_NAME
export const PER_UNIT_ADDED_TIME = 2
export type AllowedStoresFeatures = "kind" | "discount" | "freeShipment" | "all"
export type StoreWithTags = Store & {
  tags?: string[]
}
export const MAX_COMMENT_SIZE = 160
export const SCORE_ROUNDING = 2
export const READY_TIME_OFFSET = 15

export const COOKIE_ADDRESS = "addressId"
export const COOKIE_City = "city"

export const SVG_ICON_PREFIX = "_svg_"

export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 30

export const MIN_EMAIL_LENGTH = 3
export const MAX_EMAIL_LENGTH = 30