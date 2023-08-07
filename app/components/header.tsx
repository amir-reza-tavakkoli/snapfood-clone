import { useState } from "react"

import { Form, Link } from "@remix-run/react"

import { Icon } from "./icon"
import { Button } from "./button"

import { routes } from "../routes"

import type { Address } from "@prisma/client"

import { getFullAddress } from "../utils/utils"

import { useSearch } from "../hooks/search"

import {
  DEFAULT_IMG_PLACEHOLDER,
  VENDOR_NAME,
  VENDOR_NAME_ENG,
} from "../constants"

type HeaderProps = {
  address?: Address | null
  about?: string
  dir?: "rtl" | "lrt"
  toggleMenu?: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header = ({
  about = VENDOR_NAME,
  address,
  dir,
  toggleMenu,
}: HeaderProps) => {
  const [searchValue, setSearchValue] = useState("")

  const { searchData } = useSearch({
    searchValue,
  })

  return (
    <header className="header" dir={dir}>
      <h1 className="nonvisual">{VENDOR_NAME}</h1>

      <Link to={routes.index} aria-label="Home" className="_vendor">
        <Icon name={VENDOR_NAME_ENG} role="presentation" />
      </Link>

      <div className="_identity">
        <Icon name="navigation" role="presentation"></Icon>

        <Link aria-label="Address" to={routes.addresses}>
          {address ? getFullAddress(address) : "آدرس را انتخاب کنید"}
        </Link>

        <Icon name="flash" color="accent" className="_arrow"></Icon>
      </div>

      <Form
        name="search"
        className="_search_stores"
        replace={false}
        reloadDocument={false}
      >
        <label htmlFor="__search" className="_search">
          <span className="nonvisual">Search {about}</span>

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

        <Button
          type="submit"
          className="_submit"
          icon={{ name: "search", color: "faded" }}
        >
          <span className="nonvisual">Submit</span>
        </Button>

        <Link to={routes.searchPage}>
          <Button
            className="_backup-button"
            type="button"
            icon={{ name: "search", color: "faded" }}
            role="presentation"
          >
            <span className="nonvisual">Search</span>
          </Button>
        </Link>

        <div role="presentation"></div>
      </Form>

      <span className="_buttons">
        <Button
          variant="primary"
          icon={{ name: "user", color: "text" }}
          type="button"
          aria-label="Account"
          onClick={() => (toggleMenu ? toggleMenu(prev => !prev) : null)}
        >
          <span className="nonvisual">User</span>
        </Button>

        <Button variant="primary" type="button" dir={dir} className="_orders">
          <Icon name="order"></Icon>

          <Link to={routes.orders}> سفارش ها</Link>
        </Button>
      </span>

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
                  src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                  alt=""
                  role="presentation"
                  loading="lazy"
                  width={40}
                  height={40}
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
                src={itemInStore.item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                alt=""
                role="presentation"
                loading="lazy"
                width={40}
                height={40}
              />

              <ul>
                {itemInStore.stores.map((store, index) =>
                  store ? (
                    <li key={index}>
                      <Link to={routes.store(store.id)}>
                        {store.name}

                        <img
                          src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                          alt=""
                          role="presentation"
                          loading="lazy"
                          width={40}
                          height={40}
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
    </header>
  )
}
