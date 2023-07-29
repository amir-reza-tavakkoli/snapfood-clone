import { useEffect, useState } from "react"
import { routes } from "~/routes"
import { SearchType } from "~/routes/search"

export function useSearch({
  searchValue,

}: {
  searchValue : string
}) {
  const [searchData, setSearchData] = useState<SearchType>()

  useEffect(() => {
    async function fetchData() {
      if (searchValue == "") return
      const data = await fetch(routes.search + `?search=${searchValue}`)

      const jsonData = (await data.json()) as unknown as SearchType

      setSearchData(jsonData)
    }

    fetchData()
  }, [searchValue])

  return { searchData,setSearchData }
}