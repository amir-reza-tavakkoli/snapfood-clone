import { Address, City, StoreKind } from "@prisma/client"
import { Outlet, useLoaderData, useLocation } from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import { memo, useEffect, useState } from "react"
import { Header } from "~/components/header"
import { CategoryNav } from "~/components/nav"

import { getUserAddresses } from "~/utils/address.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getStoresKind, getSupportedCities } from "~/utils/store.query.server"
import { CityList } from "~/components/city-list"
import { Footer } from "~/components/footer"

import homeCss from "./styles/home.css"
import headerCss from "./../components/header.css"
import buttonCss from "./../components/button.css"
import iconCss from "./../components/icon.css"
import categoryNavCss from "./../components/nav.css"
import storeContainerCss from "./../components/store-container.css"
import cityListCss from "./../components/city-list.css"
import footerCss from "./../components/footer.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeCss },
  { rel: "stylesheet", href: buttonCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: headerCss },
  { rel: "stylesheet", href: categoryNavCss },
  { rel: "stylesheet", href: storeContainerCss },
  { rel: "stylesheet", href: cityListCss },
  { rel: "stylesheet", href: footerCss },
]

function linksHierarchy() {
  const location = useLocation().pathname
  const splits = location.split("/")
  const hierarchy: string[] = []

  splits.forEach(split => {
    if (
      split === "home" ||
      split === "stores" ||
      split === "orders" ||
      split === "orders-summary" ||
      split === "cart" ||
      split === "bill"
    ) {
      hierarchy.push(split)
    }
  })

  console.log(hierarchy)

  return hierarchy
}

export const DEAFULT_DIRECTION = "rtl"

export const loader = async ({
  request,
}: LoaderArgs): Promise<{
  addresses: Address[]
  storesKind: StoreKind[]
  cities: City[] | null
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const addresses = await getUserAddresses({ phoneNumber })

    const storesKind = await getStoresKind()

    const cities = await getSupportedCities()
    return { addresses, storesKind, cities }
  } catch (error) {
    throw error
  }
}

function arePropsEqual() {
  return true
}

export default function Home() {
  linksHierarchy()

  const { addresses, storesKind, cities } = useLoaderData<typeof loader>()
  const [addressState, setAddressState] = useState<any>()

  const FooterMemo = memo(Footer, arePropsEqual)
  const CategoryNavMemo = memo(CategoryNav, arePropsEqual)
  const CityListMemo = memo(CityList, arePropsEqual)

  useEffect(() => {
    const choosedAddressId = Number(localStorage.getItem("addressId"))

    if (!choosedAddressId) return

    const choosedAddress = addresses.find(
      address => address.id == choosedAddressId,
    )

    if (!choosedAddress) return

    if (!addressState) setAddressState(choosedAddress)

    if (choosedAddressId !== addressState?.id) {
      setAddressState(choosedAddress)
    }
  })

  return (
    <>
      <div className="_home_container">
        <Header
          dir={DEAFULT_DIRECTION}
          address={addressState?.address ?? "آدرس را آنتخاب کنید"}
        ></Header>
        <CategoryNavMemo
          dir={DEAFULT_DIRECTION}
          type="Categories"
          items={storesKind.map(kind => {
            return {
              name: kind.name,
              avatarUrl: kind.avatarUrl,
              href: `/home/stores/kind/${kind.name}`,
            }
          })}
        ></CategoryNavMemo>
      </div>
      <Outlet context={[addresses, setAddressState]}></Outlet>
      {cities ? (
        <CityListMemo
          dir={DEAFULT_DIRECTION}
          title="اسنپ‌فود در شهرهای ایران"
          items={cities?.map(city => {
            return {
              name: city.name,
              href: city.latinName
                ? `/home/stores/${city.latinName}`
                : undefined,
            }
          })}
        ></CityListMemo>
      ) : undefined}
      <FooterMemo dir={DEAFULT_DIRECTION}></FooterMemo>
    </>
  )
}
