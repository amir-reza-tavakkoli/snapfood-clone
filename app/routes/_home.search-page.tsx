import { useState } from "react"

import { Form, Link, V2_MetaFunction } from "@remix-run/react"

import type { LinksFunction } from "@remix-run/server-runtime"

import { Button } from "../components/button"
import { Icon } from "../components/icon"

import { useSearch } from "../hooks/search"

import { routes } from "../routes"

import { DEFAULT_IMG_PLACEHOLDER } from "../constants"

import pageCss from "./styles/search-page.css"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: pageCss }]

export const meta: V2_MetaFunction = () => {
  const { description, title } = {
    description: "Snappfood Clone Search Page",
    title: "Snappfood Clone Search Page",
  }

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title },
  ]
}

export default function SearchPage() {
  const [searchValue, setSearchValue] = useState("")

  const { searchData } = useSearch({
    searchValue,
  })

  return (
    <main className="search-page">
      <Form
        name="search"
        className="_search_stores"
        replace={false}
        reloadDocument={false}
      >
        <label htmlFor="__search" className="_search">
          <span className="nonvisual">Search</span>

          <input
            autoComplete="on"
            type="search"
            name="search"
            id="__search"
            placeholder="جست و جو در رستوران ها"
            onChange={e => {
              setSearchValue(e.target.value)
            }}
          />
        </label>

        <Icon name="search" color="faded"></Icon>

        <span className="nonvisual">Submit</span>
      </Form>

      {searchData &&
      (searchData.stores || searchData.itemsAndStores) &&
      (searchData.stores.length > 0 || searchData.itemsAndStores.length > 0) &&
      searchValue &&
      searchValue !== "" ? (
        <ul className="search-bar" aria-live="polite" aria-atomic="true">
          <Button
            variant="primary"
            onClick={() => setSearchValue("")}
            aria-label="Close"
          >
            <Icon name="multiply"></Icon>
          </Button>

          {searchData.stores && searchData.stores.length > 0 ? (
            <p>فروشگاه ها</p>
          ) : null}

          {searchData.stores?.map((store, index) => (
            <li key={index} aria-label="Store">
              <Link to={routes.store(store.id)}>
                {store.name}

                <img
                  width={40}
                  height={40}
                  src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                  alt=""
                  role="presentation"
                  loading="lazy"
                />
              </Link>
            </li>
          ))}

          {searchData.itemsAndStores && searchData.itemsAndStores.length > 0 ? (
            <p>آیتم ها</p>
          ) : null}

          {searchData?.itemsAndStores?.map((itemInStore, index) => (
            <li key={index} aria-label="Store">
              {itemInStore.item.name}

              <img
                width={40}
                height={40}
                src={itemInStore.item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                alt=""
                role="presentation"
                loading="lazy"
              />

              <ul>
                {itemInStore.stores.map((store, index) =>
                  store ? (
                    <li key={index}>
                      <Link to={routes.store(store.id)}>
                        {store.name}

                        <img
                          width={40}
                          height={40}
                          src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                          alt=""
                          role="presentation"
                          loading="lazy"
                        />
                      </Link>
                    </li>
                  ) : null,
                )}
              </ul>
            </li>
          ))}
        </ul>
      ) : searchValue && searchValue !== "" ? (
        <ul className="search-bar _no-found">
          <p>آیتمی یافت نشد</p>

          <Button
            variant="primary"
            onClick={() => setSearchValue("")}
            aria-label="Close"
          >
            <Icon name="multiply"></Icon>
          </Button>
        </ul>
      ) : null}
    </main>
  )
}
