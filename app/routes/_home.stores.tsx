import React from "react"

import { Link, Outlet, useLoaderData } from "@remix-run/react"

import type { LinksFunction, LoaderArgs } from "@remix-run/node"

import type { Address, ItemCategory } from "@prisma/client"

import { ImageItem } from "~/components/image-item"
import { GlobalErrorBoundary } from "~/components/error-boundary"

import { getItemCategories } from "~/queries.server/item.query.server"
import { getUserAddresses } from "~/queries.server/address.query.server"
import { getUserByPhone } from "~/queries.server/user.query.server"

import { useForceAddress } from "~/hooks/forceAddress"

import { requirePhoneNumber } from "~/utils/session.server"

import { validateUser } from "~/utils/validate.server"

import { DEFAULT_IMG_PLACEHOLDER } from "~/constants"

import imageItemCss from "./../components/styles/image-item.css"
import pageCss from "./styles/stores-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: imageItemCss },
  { rel: "stylesheet", href: pageCss },
]

type LoaderType = {
  categories: ItemCategory[]
  addresses: Address[]
}

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
  try {
    const phoneNumber = await requirePhoneNumber(request)

    let user = await getUserByPhone({ phoneNumber })

    user = validateUser({ user })

    const categories = await getItemCategories()

    const addresses = await getUserAddresses({ phoneNumber })

    return { categories, addresses }
  } catch (error) {
    throw error
  }
}

export default function StoresPage() {
  const { categories, addresses } = useLoaderData() as unknown as LoaderType

  const { citystate } = useForceAddress({ addresses })

  const MemoizedList = React.memo(
    () => (
      <nav>
        {categories
          ? categories.map((category, index) => (
              <Link
                to={`/stores/${citystate}/all/kind/${category.name}`}
                key={index}
              >
                <ImageItem
                  image={category.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                  title={category.name}
                ></ImageItem>
              </Link>
            ))
          : null}
      </nav>
    ),
    () => true,
  )

  return (
    <>
      <nav className="_stores-page">
        <p aria-label="Categories">دسته بندی ها</p>

        <MemoizedList></MemoizedList>
      </nav>
      <Outlet></Outlet>
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
