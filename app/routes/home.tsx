import { Address, StoreKind } from "@prisma/client"
import { Outlet, useLoaderData} from "@remix-run/react"
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime"
import { useEffect, useState } from "react"
import { Header } from "~/components/header"
import { CategoryNav } from "~/components/nav"

import {
  getUserAddresses,
} from "~/utils/address.query.server"

import { requirePhoneNumber } from "~/utils/session.server"
import { getUserByPhone } from "~/utils/user.query.server"
import { getStoresKind } from "~/utils/store.query.server"

import headerCss from "./../components/header.css"
import buttonCss from "./../components/button.css"
import iconCss from "./../components/icon.css"
import categoryNavCss from "./../components/nav.css"
import homeCss from "./styles/home.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: homeCss },
  { rel: "stylesheet", href: buttonCss },
  { rel: "stylesheet", href: iconCss },
  { rel: "stylesheet", href: headerCss },
  { rel: "stylesheet", href: categoryNavCss },
]

export const loader = async ({
  request,
}: LoaderArgs): Promise<{
  addresses: Address[]
  storesKind: StoreKind[]
}> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    const addresses = await getUserAddresses({ phoneNumber })

    const storesKind = await getStoresKind()

    return { addresses, storesKind }
  } catch (error) {
    throw error
  }
}

export default function Home() {
  const { addresses, storesKind } = useLoaderData<typeof loader>()
  const [addressState, setAddressState] = useState<any>()

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
          dir="rtl"
          address={addressState?.address ?? "آدرس را آنتخاب کنید"}
        ></Header>
        <CategoryNav
          type="Categories"
          items={storesKind.map(kind => {
            return {
              name: kind.name,
              avatarUrl: kind.avatarUrl,
              href: `/home/stores/kind/${kind.name}`,
            }
          })}
        ></CategoryNav>
      </div>
      <Outlet context={[addresses, setAddressState]}></Outlet>
    </>
  )
}
