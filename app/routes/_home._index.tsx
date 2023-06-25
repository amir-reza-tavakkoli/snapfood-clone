import { useEffect, useState } from "react"
import { Link, useLoaderData, useNavigate } from "@remix-run/react"
import { ImageItem } from "~/components/image-item"
import { LinksFunction, LoaderArgs } from "@remix-run/node"
import { getItemCategories } from "~/utils/store.query.server"

import imageItemCss from "./../components/styles/image-item.css"
import homeIndexCss from "./styles/home-index.css"
import { DEFAULT_CITY } from "~/constants"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: imageItemCss },
  { rel: "stylesheet", href: homeIndexCss },
]

export const loader = async ({ request }: LoaderArgs) => {
  try {
    const categories = await getItemCategories()

    return categories
  } catch (error) {
    throw error
  }
}

export default function Home() {
  const [city, setCity] = useState(DEFAULT_CITY)
  const categories = useLoaderData<typeof loader>()

  const navigate = useNavigate()

  useEffect(() => {
    const cityName = localStorage.getItem("city")

    if (cityName) {
      setCity(cityName)
    } else {
      setTimeout(() => navigate("/home/addresses"), 2000)
    }
  }, [city])

  return (
    <>
      <Link to={`stores/${city}`}>رفتن به فروشگاه ها</Link>
      <p className="_category-container-p">دسته بندی ها</p>
      <article className="_category-container">
        {categories
          ? categories.map((category, index) => (
              <Link to={`/home/stores/${category.name}`} key={index}>
                <ImageItem
                  image={category.avatarUrl ?? ""}
                  title={category.name}
                ></ImageItem>
              </Link>
            ))
          : null}
      </article>
    </>
  )
}
