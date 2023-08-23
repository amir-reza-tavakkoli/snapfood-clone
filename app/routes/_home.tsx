import { memo, useEffect, useState } from "react"

import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react"

import {
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
} from "@remix-run/server-runtime"

import type { Address, City, StoreKind, User } from "@prisma/client"

import { Header } from "../components/header"
import { CategoryNav } from "../components/nav"
import { CityList } from "../components/city-list"
import { Footer } from "../components/footer"
import { FanBanner } from "../components/fan-banner"
import { OwnerBanner } from "../components/owner-banner"
import { IntroBanner } from "../components/intro-banner"
import { GlobalErrorBoundary } from "../components/error-boundary"
import { UserMenu } from "../components/user-menu"
import { PageNav } from "../components/page-nav"
import { Logo } from "../components/logo"

import { requireUser } from "../utils/validate.server"
import { isUnAuthenticated } from "../utils/utils"

import { getUserAddresses } from "../queries.server/address.query.server"
import { getStoresKinds } from "../queries.server/store.query.server"
import { getSupportedCities } from "../queries.server/address.query.server"

import { useSplash } from "../hooks/splash"
import { useForceAddress } from "../hooks/forceAddress"

import { routes } from "../routes"

import {
  CLIENT_CACHE_DURATION,
  DEAFULT_DIRECTION,
  DEFAULT_CITY,
} from "../constants"

import addressesCss from "./../components/styles/addresses.css"
import ratingsCss from "@smastrom/react-rating/style.css"
import pageCss from "./styles/home-page.css"
import headerCss from "./../components/styles/header.css"
import buttonCss from "./../components/styles/button.css"
import iconCss from "./../components/styles/icon.css"
import categoryNavCss from "./../components/styles/nav.css"
import storeContainerCss from "./../components/styles/store-container.css"
import cityListCss from "./../components/styles/city-list.css"
import footerCss from "./../components/styles/footer.css"
import pageNavCss from "./../components/styles/page-nav.css"
import userMenuCss from "./../components/styles/user-menu.css"
import ownerBannerCss from "./../components/styles/owner-banner.css"
import fanBannerCss from "./../components/styles/fan-banner.css"
import errorBoundaryCss from "./../components/styles/error-boundary.css"
import introBannerCss from "./../components/styles/intro-banner.css"
import logoCss from "./../components/styles/logo.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: ratingsCss },
  { rel: "stylesheet", href: buttonCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: errorBoundaryCss },
  { rel: "stylesheet", href: headerCss },
  { rel: "stylesheet", href: categoryNavCss },
  { rel: "stylesheet", href: ownerBannerCss },
  { rel: "stylesheet", href: fanBannerCss },
  { rel: "stylesheet", href: introBannerCss },
  { rel: "stylesheet", href: cityListCss },
  { rel: "stylesheet", href: storeContainerCss },
  { rel: "stylesheet", href: footerCss },
  { rel: "stylesheet", href: pageNavCss },
  { rel: "stylesheet", href: userMenuCss },
  { rel: "stylesheet", href: addressesCss },
  { rel: "stylesheet", href: logoCss },
  { rel: "stylesheet", href: pageCss },
]

type LoaderType = {
  addresses: Address[] | null
  storesKind: StoreKind[]
  cities: City[]
  user: User | null
}

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const storesKind = await getStoresKinds()

    const cities = await getSupportedCities()

    const user = await requireUser(request)

    const addresses = await getUserAddresses({
      phoneNumber: user.phoneNumber,
    })

    return json(
      {
        addresses: addresses,
        storesKind,
        cities,
        user,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CLIENT_CACHE_DURATION}`,
        },
      },
    )
  } catch (error) {
    throw error
  }
}

export default function HomePage() {
  const { addresses, storesKind, cities, user } =
    useLoaderData() as unknown as LoaderType

  const navigate = useNavigate()

  const location = useLocation()

  const FooterMemo = memo(Footer, () => true)

  const CityListMemo = memo(CityList, () => true)

  const CategoryNavMemo = memo(CategoryNav, () => true)

  const [userMenuShowing, setUserMenuShowing] = useState(false)

  const { addressState, setAddressState, cityState, setCityState } =
    useForceAddress({ addresses, user })

  const { splash } = useSplash()

  const [redirect, setRedirect] = useState(true)

  useEffect(() => {
    if (
      user &&
      !isUnAuthenticated(user.phoneNumber) &&
      cityState &&
      redirect &&
      cityState !== "" &&
      location.pathname === routes.index
    ) {
      setRedirect(false)

      navigate(routes.storesCity(cityState))

      return
    }
  })

  return (
    <>
      {user && !isUnAuthenticated(user.phoneNumber) ? (
        <>
          <div className="_headers-container">
            <Header
              dir={DEAFULT_DIRECTION}
              address={addressState}
              toggleMenu={setUserMenuShowing}
            ></Header>
          </div>

          {storesKind ? (
            <CategoryNav
              dir={DEAFULT_DIRECTION}
              type="Categories"
              items={storesKind.map(kind => {
                return {
                  name: kind.name,
                  avatarUrl: kind.avatarUrl,
                  href: routes.storesKind(cityState, kind.name),
                }
              })}
            ></CategoryNav>
          ) : null}

          <UserMenu
            user={user}
            isShowing={userMenuShowing}
            setShowing={setUserMenuShowing}
          ></UserMenu>

          <PageNav></PageNav>

          <Outlet context={[addressState, setAddressState]}></Outlet>
        </>
      ) : location.pathname === routes.index ? (
        <>
          {storesKind ? (
            <IntroBanner
              storesKind={storesKind}
              city={DEFAULT_CITY}
            ></IntroBanner>
          ) : null}

          <FanBanner></FanBanner>

          <OwnerBanner></OwnerBanner>
        </>
      ) : (
        <>
          <div className="_headers-container">
            <Header
              dir={DEAFULT_DIRECTION}
              address={addressState}
              toggleMenu={setUserMenuShowing}
            ></Header>
          </div>

          {storesKind ? (
            <CategoryNavMemo
              dir={DEAFULT_DIRECTION}
              type="Categories"
              items={storesKind.map(kind => {
                return {
                  name: kind.name,
                  avatarUrl: kind.avatarUrl,
                  href: routes.storesKind(cityState, kind.name),
                }
              })}
            ></CategoryNavMemo>
          ) : null}

          <Outlet></Outlet>
        </>
      )}

      {splash ? <Logo></Logo> : null}

      {cities ? (
        <CityListMemo
          dir={DEAFULT_DIRECTION}
          title="اسنپ‌فود در شهرهای ایران"
          items={cities.map(city => {
            return {
              name: city.name,
              href: city.latinName
                ? routes.storesCity(city.name)
                : undefined,
            }
          })}
        ></CityListMemo>
      ) : null}

      <FooterMemo dir={DEAFULT_DIRECTION}></FooterMemo>
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
