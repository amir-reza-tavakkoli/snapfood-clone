import React from "react"

import { Link, Outlet, useLoaderData } from "@remix-run/react"

import {
  json,
  LinksFunction,
  LoaderArgs,
  TypedResponse,
  V2_MetaFunction,
} from "@remix-run/node"

import type { Address, ItemCategory, User } from "@prisma/client"

import { ImageItem } from "../components/image-item"
import { GlobalErrorBoundary } from "../components/error-boundary"

import { getItemCategories } from "../queries.server/item.query.server"
import { getUserAddresses } from "../queries.server/address.query.server"

import { useForceAddress } from "../hooks/forceAddress"

import { requireUser } from "../utils/validate.server"

import { routes } from "../routes"

import { CLIENT_CACHE_DURATION, DEFAULT_IMG_PLACEHOLDER } from "../constants"

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
  user: User
}

export const loader = async ({
  request,
}: LoaderArgs): Promise<TypedResponse<LoaderType>> => {
  try {
    const user = await requireUser(request)

    const categories = await getItemCategories()

    const addresses = await getUserAddresses({ phoneNumber: user.phoneNumber })

    return json(
      { categories, addresses, user },
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

export default function StoresPage() {
  const { categories, addresses, user } =
    useLoaderData() as unknown as LoaderType

  const { cityState } = useForceAddress({
    addresses,
    user,
  })

  const MemoizedList = React.memo(
    () => (
      <ul>
        {categories
          ? categories.map((category, index) => (
              <li key={index}>
                <Link to={routes.storesCategory(cityState, category.name)}>
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
        <h1 aria-label="Categories" className="nonvisual">
          دسته بندی ها
        </h1>

        <MemoizedList></MemoizedList>
      </nav>

      <Outlet></Outlet>
    </>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
