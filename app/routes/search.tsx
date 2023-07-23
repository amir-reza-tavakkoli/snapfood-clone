import { Form, useFetcher, useLoaderData, useSearchParams, useSubmit } from "@remix-run/react"
import { ActionArgs, LoaderArgs } from "@remix-run/server-runtime"
import { useState } from "react"
import { searchItem, searchStore } from "~/queries.server/search.server"


export const loader = async ({ request }: LoaderArgs) => {
  const search = new URL(request.url).searchParams.get("search")
console.log("in");

  if (!search || typeof search !== "string" || search === "") {
    return null
  }
  console.log(await searchStore({param : "d"}))

  const stores = await searchStore({ param: search })

  const itemsAndStores = await searchItem({ param: search })

  return { stores, itemsAndStores }

}


export default function SomeComponent() {
  const fetcher = useFetcher()
  let [searchParams, setSearchParams] = useSearchParams()
  const x = useLoaderData()

  console.log(x)

  const [state, setstate] = useState("")



  const [marker, setMarker] = useState<any>(null)

  function handleChange(event: any) {
    console.log(event.currentTarget)
    submit(event.currentTarget, { replace: true })
  }

  const submit = useSubmit()
  return (
    <Form
      replace={false}
      reloadDocument={false}
      // ref={setMarker}
      // onChange={e => handleChange(e)}
    >
      <input
        id="ddd"
        type="text"
        name="search"
        onChange={e => {
          setSearchParams({search: e.target.value})
          setstate(e.target.value)
          // handleChange(e)
        }}
      />
    </Form>
  )
}
