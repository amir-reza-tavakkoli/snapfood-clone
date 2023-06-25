import { Address, City, StoreKind, User } from "@prisma/client"
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
import headerCss from "./../components/styles/header.css"
import buttonCss from "./../components/styles/button.css"
import iconCss from "./../components/styles/icon.css"
import categoryNavCss from "./../components/styles/nav.css"
import storeContainerCss from "./../components/styles/store-container.css"
import cityListCss from "./../components/styles/city-list.css"
import footerCss from "./../components/styles/footer.css"
import userMenuCss from "./../components/styles/user-menu.css"
import { UserMenu } from "~/components/user-menu"
import { DEAFULT_DIRECTION } from "~/constants"
import { getUserByPhone } from "~/utils/user.query.server"

import addressesCss from "./../components/styles/addresses.css"
import { validateUser } from "~/utils/utils.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeCss },
  { rel: "stylesheet", href: buttonCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: headerCss },
  { rel: "stylesheet", href: categoryNavCss },
  { rel: "stylesheet", href: storeContainerCss },
  { rel: "stylesheet", href: cityListCss },
  { rel: "stylesheet", href: footerCss },
  { rel: "stylesheet", href: userMenuCss },
  { rel: "stylesheet", href: addressesCss },
]

export const loader = async ({
  request,
}: LoaderArgs): Promise<{
  addresses: Address[]
  storesKind: StoreKind[]
  cities: City[] | null
  user: User | null
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const user = await getUserByPhone({ phoneNumber })

    validateUser({user})

    const addresses = await getUserAddresses({ phoneNumber })

    const storesKind = await getStoresKind()

    const cities = await getSupportedCities()

    return { addresses, storesKind, cities, user }
  } catch (error) {
    throw error
  }
}

function arePropsEqual() {
  return true
}

export default function Home() {
  const { addresses, storesKind, cities, user } = useLoaderData<
    typeof loader
  >() as unknown as {
    addresses: Address[]
    storesKind: StoreKind[]
    cities: City[] | null
    user: User | null
  }


  const [userMenuShowing, setUserMenuShowing] = useState(false)
  const [addressState, setAddressState] = useState<any>()

  const [cityName, setCityName] = useState("")

  useEffect(() => {
    const choosedCity = localStorage.getItem("city")
    if (choosedCity) setCityName(choosedCity)
  })

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
              href: `/stores/${cityName}/kind/${kind.name}`,
            }
          })}
        ></CategoryNavMemo>
      </div>
      <button onClick={() => setUserMenuShowing(prev => !prev)} type="button">
        gdfgfdgfdg
      </button>
      <Outlet context={[addresses, setAddressState]}></Outlet>
      {user ? (
        <UserMenu user={user} isShowing={userMenuShowing}></UserMenu>
      ) : null}
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
