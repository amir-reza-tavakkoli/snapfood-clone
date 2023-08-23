import type {
  Address,
  Comment,
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
  "https://i.postimg.cc/j24zSsfp/placeholder.png"

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
export const INVALID_ADDRESS_RANGE = -1
export const MAX_ORDER_DELAY = 10

export const CLIENT_CACHE_DURATION = 300 // sec

export const DEFAULT_USER_NAME = "کاربر"
export type RESPONDED_BY = "مدیر رستوران" | typeof VENDOR_NAME
export type AllowedStoresFeatures =
  | "kind"
  | "discount"
  | "freeShipment"
  | "all"
  | "category"
  | "bestInTown"
export type StoreWithTags = Store & {
  tags?: string[]
}

export type SearchType = {
  stores: Store[]
  itemsAndStores: {
    item: Item
    stores: (Store | null)[]
  }[]
} | null

export type SearchParams = { param: string; takeThisMuch?: number }

export type ChangeOrderItemState = "add" | "set" | "remove"

export type CartCompProps = {
  items: JoinedOrderItem[]
  order: Order
  store: Store
  totalPrice?: number
  dir?: "rtl" | "lrt"
  comment?: Comment | null
  commentSection?: boolean
  billSection?: boolean
  address: Address | null
  schedule: storeSchedule[]
  storeAddress?: Address
}

export type CartProps = {
  orders:
    | {
        items: JoinedOrderItem[]
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

export type JoinedOrderStore = {
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

export type JoinedOrderItem = {
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

export const MAX_SCORE = 5
export const MIN_SCORE = 1

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

export const VERIFIED_PHONE = "09900249950"

export const UNAUTH_USER_PHONE = "0"

export const UNAUTHENTICATED_USER: User = {
  firstName: "مهمان",
  gender: false,
  phoneNumber: "0",
  isVerified: true,
  isSuspended: false,
  credit: 0,
  birthday: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: null,
  lastName: null,
  verificationCode: null,
  verificationCodeExpiry: null,
}

export const UNAUTHENTICATED_USER_ADDRESS: Address = {
  address: "ابتدا وارد شوید",
  cityName: DEFAULT_CITY,
  isAvailible: true,
  isValid: true,
  createdAt: new Date(),
  id: 1,
  unit: 0,
  userPhoneNumber: "0",
  updatedAt: new Date(),
  xAxis: DEFAULT_COORDINATIONS.xAxis,
  yAxis: DEFAULT_COORDINATIONS.yAxis,
  details: null,
  postalCode: null,
  title: null,
}
