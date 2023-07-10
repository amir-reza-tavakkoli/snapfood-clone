import { memo, useState } from "react"

import { Outlet, useLoaderData } from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"

import type { Address, City, StoreKind, User } from "@prisma/client"

import { Header } from "~/components/header"
import { CategoryNav } from "~/components/nav"
import { CityList } from "~/components/city-list"
import { Footer } from "~/components/footer"
import { UserMenu } from "~/components/user-menu"

import { requirePhoneNumber } from "~/utils/session.server"

import { getUserAddresses } from "~/queries.server/address.query.server"
import { getStoresKinds } from "~/queries.server/store.query.server"
import { getSupportedCities } from "~/queries.server/address.query.server"
import { getUserByPhone } from "~/queries.server/user.query.server"

import { validateUser } from "~/utils/validate.server"

import { DEAFULT_DIRECTION } from "~/constants"

import addressesCss from "./../components/styles/addresses.css"
import ratingsCss from "@smastrom/react-rating/style.css"
import pageCss from "./styles/home.css"
import headerCss from "./../components/styles/header.css"
import buttonCss from "./../components/styles/button.css"
import iconCss from "./../components/styles/icon.css"
import categoryNavCss from "./../components/styles/nav.css"
import storeContainerCss from "./../components/styles/store-container.css"
import cityListCss from "./../components/styles/city-list.css"
import footerCss from "./../components/styles/footer.css"
import userMenuCss from "./../components/styles/user-menu.css"
import { useForceAddress } from "~/hooks/forceAddress"
import { GlobalErrorBoundary } from "~/components/error-boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: ratingsCss },
  { rel: "stylesheet", href: buttonCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: headerCss },
  { rel: "stylesheet", href: categoryNavCss },
  { rel: "stylesheet", href: cityListCss },
  { rel: "stylesheet", href: storeContainerCss },
  { rel: "stylesheet", href: footerCss },
  { rel: "stylesheet", href: userMenuCss },
  { rel: "stylesheet", href: addressesCss },
  { rel: "stylesheet", href: pageCss },
]

type LoaderType = {
  addresses: Address[]
  storesKind: StoreKind[]
  cities: City[] | null
  user: User
}

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    let user = await getUserByPhone({ phoneNumber })

    user = validateUser({ user })

    const addresses = await getUserAddresses({ phoneNumber })

    const storesKind = await getStoresKinds()

    const cities = await getSupportedCities()

    return { addresses, storesKind, cities, user }
  } catch (error) {
    throw error
  }
}

export default function HomePage() {
  const { addresses, storesKind, cities, user } =
    useLoaderData() as unknown as LoaderType

  const FooterMemo = memo(Footer, arePropsEqual)
  const CategoryNavMemo = memo(CategoryNav, arePropsEqual)
  const CityListMemo = memo(CityList, arePropsEqual)

  const [userMenuShowing, setUserMenuShowing] = useState(false)

  const { addressState, setAddressState, citystate, setCityState } =
    useForceAddress({ addresses })

  return (
    <>
      <div className="_headers-container">
        <Header
          dir={DEAFULT_DIRECTION}
          address={addressState?.address ?? "آدرس را آنتخاب کنید"}
          toggleMenu={setUserMenuShowing}
        ></Header>

        <CategoryNavMemo
          dir={DEAFULT_DIRECTION}
          type="Categories"
          items={storesKind.map(kind => {
            return {
              name: kind.name,
              avatarUrl: kind.avatarUrl,
              href: `/stores/${citystate}/kind/${kind.name}`,
            }
          })}
        ></CategoryNavMemo>
      </div>

      <UserMenu user={user} isShowing={userMenuShowing}></UserMenu>

      <Outlet context={[addresses, setAddressState]}></Outlet>

      {cities ? (
        <CityListMemo
          dir={DEAFULT_DIRECTION}
          title="اسنپ‌فود در شهرهای ایران"
          items={cities?.map(city => {
            return {
              name: city.name,
              href: city.latinName ? `/stores/${city.latinName}` : undefined,
            }
          })}
        ></CityListMemo>
      ) : undefined}

      <FooterMemo dir={DEAFULT_DIRECTION}></FooterMemo>
    </>
  )
}

function arePropsEqual() {
  return true
}

export const ErrorBoundary = GlobalErrorBoundary
