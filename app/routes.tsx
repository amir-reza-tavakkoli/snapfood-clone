export const routes = {
  index: "/",
  login: "/login",
  logout: "/logout",
  search: "/search",
  wallet: "/wallet",
  userInfo: "/user-info",
  about: "/about",

  addresses: "/addresses",
  address: (id: string | number) => `/address/${id}`,

  stores: "/stores",
  store: (id: string | number) => `/store/${id}`,
  storeInfo: (id: string | number) => `/store-info/${id}`,
  storesCity: (city: string) => `/stores/${city}`,
  storesFeature: (city: string, feature: string) =>
    `/stores/${city}/all/${feature}`,
  storesKind: (city: string, kind: string) =>
    `/stores/${city}/all/kind/${kind}`,

  orders: "/orders",
  ordersSummary: "/orders-summary",
  order: (id: string | number) => `/order/${id}`,
  bill: (id: string | number) => `/bill/${id}`,
  checkout: (id: string | number) => `/checkout/${id}`,
  cart: "/cart",
  comment: (id: string | number) => `/comment/${id}`,

  itemStore: (itemId: string | number, storeId: string | number) =>
    `/item/${itemId}/store/${storeId}`,

  notImplemented: "/nowhere",
}
