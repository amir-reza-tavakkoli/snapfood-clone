import React from "react"

import { Link, Outlet, useLoaderData } from "@remix-run/react"

import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node"

import type { Address, ItemCategory } from "@prisma/client"

import { ImageItem } from "../components/image-item"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { getItemCategories } from "../queries.server/item.query.server"
import { getUserAddresses } from "../queries.server/address.query.server"

import { useForceAddress } from "../hooks/forceAddress"

import { requireValidatedUser } from "../utils/validate.server"

import { DEFAULT_IMG_PLACEHOLDER } from "../constants"

import { routes } from "~/routes"

import imageItemCss from "./../components/styles/image-item.css"
import pageCss from "./styles/stores-page.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: imageItemCss },
  { rel: "stylesheet", href: pageCss },
]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: `SnappFood Clone Stores`,
    title: `SnappFood Clone Stores`,
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

type LoaderType = {
  categories: ItemCategory[]
  addresses: Address[]
}

export const loader = async ({ request }: LoaderArgs): Promise<LoaderType> => {
  try {
    const user = await requireValidatedUser(request)

    const categories = await getItemCategories()

    const addresses = await getUserAddresses({ phoneNumber: user.phoneNumber })

    return { categories, addresses }
  } catch (error) {
    throw error
  }
}

export default function StoresPage() {
  const { categories, addresses } = useLoaderData() as unknown as LoaderType

  const { cityState } = useForceAddress({
    addresses,
  })

  const MemoizedList = React.memo(
    () => (
      <ul>
        {categories
          ? categories.map((category, index) => (
              <li key={index}>
                <Link to={routes.storesKind(cityState, category.name)}>
                  <ImageItem
                    image={category.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                    title={category.name}
                  ></ImageItem>
                </Link>
              </li>
            ))
          : null}
      </ul>
    ),
    () => true,
  )

  return (
    <>
      <nav className="stores-page">
        <h1 aria-label="Categories">دسته بندی ها</h1>

        <MemoizedList></MemoizedList>
      </nav>

      <Outlet></Outlet>
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
