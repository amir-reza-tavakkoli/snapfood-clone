import { Form, Link } from "@remix-run/react"

import { Icon } from "./icon"
import { Button } from "./button"

import { routes } from "~/routes"

import type { Address } from "@prisma/client"

import { getFullAddress } from "~/utils/utils"

import {
  DEFAULT_IMG_PLACEHOLDER,
  VENDOR_NAME,
  VENDOR_NAME_ENG,
} from "~/constants"
import { useEffect, useState } from "react"
import { SearchType } from "~/routes/search"

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

  const [searchData, setSearchData] = useState<SearchType>()

  useEffect(() => {
    async function fetchData() {
      if(searchValue == "")return
      const data = await fetch(routes.search + `?search=${searchValue}`)

      const jsonData = (await data.json()) as unknown as SearchType

      setSearchData(jsonData)
    }

    fetchData()
  }, [searchValue])
  console.log(searchData)

  return (
    <header className="header" dir={dir}>
      <h1 className="nonvisual">{VENDOR_NAME}</h1>

      <a href={routes.index} aria-label="Home" className="_vendor">
        <Icon name={VENDOR_NAME_ENG} role="presentation" />
      </a>

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

        <Button
          className="_backup-button"
          type="button"
          icon={{ name: "search", color: "faded" }}
          role="presentation"
        >
          <span className="nonvisual">Search</span>
        </Button>

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
      (searchData.stores.length > 0 || searchData?.itemsAndStores.length > 0) &&
      searchValue &&
      searchValue !== "" ? (
        <ul className="search-bar">
          {searchData.stores && searchData.stores.length > 0 ? <p>فروشگاه ها</p> : null}
          {searchData?.stores?.map((store, index) => (
            <li key={index} aria-label="Store">
              <Link to={routes.store(store.id)}>
                {" "}
                {store.name}
                <img
                  src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                  alt=""
                  role="presentation"
                />
              </Link>
            </li>
          ))}

          {searchData.itemsAndStores && searchData.itemsAndStores.length > 0 ? (
            <p>آیتم ها</p>
          ) : null}

          {searchData?.itemsAndStores?.map((combo, index) => (
            <li key={index} aria-label="Store">
              {combo.item.name}
              <img
                src={combo.item.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                alt=""
                role="presentation"
              />
              <ul>
                {combo.stores.map((store, index) =>
                  store ? (
                    <li key={index}>
                      <Link to={routes.store(store.id)}>
                        {store.name}
                        <img
                          src={store.avatarUrl ?? DEFAULT_IMG_PLACEHOLDER}
                          alt=""
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
        <ul className="search-bar">
          <p>آیتمی یافت نشد</p>
        </ul>
      ) : null}
    </header>
  )
}
