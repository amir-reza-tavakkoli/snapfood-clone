import type {
  Address,
  Item,
  Order,
  Store,
  storeSchedule,
  User,
} from "@prisma/client"

import { routes } from "./routes"

export const VENDOR_NAME = "اسنپ فود"
export const VENDOR_NAME_ENG = "snappfood"

export const DEFAULT_CURRENCY = "تومان"
export const DEFAULT_DELIVERY_METHOD = "ارسال اکسپرس"
export const DEFAULT_CITY = "تهران"
export const ALLOWED_PHONE_PREFIX = "09"
export const DEFAULT_IMG_PLACEHOLDER =
  "https://snappfood.ir/static/images/placeholder.png"

export const ALLOWED_URLS = [
  routes.index,
  routes.addresses,
  routes.login,
  routes.userInfo,
  routes.wallet,
  routes.about,
  routes.search,
  routes.notImplemented,
  routes.cart,
  routes.orders,
  routes.ordersSummary,
  routes.newAddress,
]

export const INDEX_URL = routes.index

export const DEFAULT_COORDINATIONS = {
  xAxis: 35.7152,
  yAxis: 51.4043,
} // tehran

export const VERIFICATION_CODE_FIGURES = 4
export const VERIFICATION_CODE_EXPIRY_MINS = 5 // mins

export const DEFAULT_MAP_ZOOM = 13

export const SVG_ICON_PREFIX = "_svg_"
export const DEAFULT_DIRECTION = "rtl"

export const DEFAULT_SHIPMENT_RADIUS = 10 // in map
export const DEFAULT_READY_TIME = 15
export const DEFAULT_SHIPMENT_TIME = 15
export const BASE_SHIPMENT_MULTIPLIER = 10
export const PER_UNIT_ADDED_TIME = 2

export const DEFAULT_USER_NAME = "کاربر"
export type RESPONDED_BY = "مدیر رستوران" | typeof VENDOR_NAME
export type AllowedStoresFeatures = "kind" | "discount" | "freeShipment" | "all"
export type StoreWithTags = Store & {
  tags?: string[]
}

export type SearchParams = { param: string; takeThisMuch?: number }

export type ChangeOrderItemState = "add" | "set" | "remove"

export type CartCompProps = {
  items: FullOrderItem[]
  order: Order
  store: Store
  totalPrice?: number
  dir?: "rtl" | "lrt"
  comment?: Comment | null
  commentSection?: boolean
  billSection?: boolean
  address: Address | null
  schedule: storeSchedule[]
}

export type CartProps = {
  orders:
    | {
        items: FullOrderItem[]
        order: Order
        store: Store
        comment?: Comment
      }[]
    | undefined

  dir?: "rtl" | "lrt"
}

export type StoreComment =
  | {
      user: User
      order: Order
      comment: Comment
      items: Item[]
    }
  | undefined

export type OrderStatus =
  | "inCart"
  | "taken"
  | "adminNotVerified"
  | "storeNotVerified"
  | "inProgress"
  | "canceled"
  | "delayed"
  | "shipped"
  | "fullfilled"

export type FullOrderStore = {
  id: number
  createdAt: Date
  updatedAt: Date
  totalPrice: number

  packagingPrice: number
  addressId: number

  isBilled: boolean
  isInCart?: boolean
  isVerifiedByAdmin?: boolean
  isVerifiedByStore?: boolean
  isShipped?: boolean
  isDelivered?: boolean
  isCanceled?: boolean
  isDelayedByStore?: boolean

  storeId?: number
  storeKindName?: string
  name?: string
  branchName?: string | null
  description?: string | null
  avatarUrl?: string | null
  cityName?: string
  minOrderPrice?: number
  shipmentPrice?: number
  estimatedShipmentTime: number
  estimatedReadyTime: number
}

export type FullOrderItem = {
  storeId?: number
  id?: number
  itemId?: number
  orderId?: number
  count?: number
  createdAt?: Date
  updatedAt?: Date
  price?: number
  name?: string
  description?: string | null
  avatarUrl?: string | null
  basePrice?: number | null
  itemCategoryName?: any
  discountPercent?: number | null
  remainingCount?: number
  estimatedReadyTime?: number
  isAvailible?: boolean
  isVerified?: boolean
}

export const SCORE_ROUNDING = 2
export const MAX_COMMENT_SIZE = 160
export const READY_TIME_OFFSET = 15

export const COOKIE_ADDRESS = "addressId"
export const COOKIE_City = "city"
export const COOKIE_PHONE = "phoneNumber"

export const DEFAULT_MIN_ADDRESS_LENGTH = 10

export const MAX_VALID_DATE_YEAR_ADDED = 1
export const MIN_VALID_DATE_YEAR = 1950

export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 30

export const MIN_READY_TIME = 0
export const MAX_READY_TIME = 200

export const MIN_EMAIL_LENGTH = 3
export const MAX_EMAIL_LENGTH = 30

export const MIN_DESCRIPTION_LENGTH = 5
export const MAX_DESCRIPTION_LENGTH = 200

export const DEFAULT_TAKE_THIS_MUCH = 4
export const MAX_ORDER_IN_CART_TIME = 30

export const NOT_MAIN_CATEGORIES = ["نوشیدنی", "خوراک", "ویژه"]
