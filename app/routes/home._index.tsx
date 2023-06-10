import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"

export default function Home() {
  const [city, setCity] = useState("تهران")

  useEffect(() => {
    if (typeof window !== "undefined") {
      return
    }

    const cityName = localStorage.getItem("city")

    useState(cityName)
  }, [city])
  return (
    <>
      <Link to={`stores/${city}`}>Go To Stores</Link>
    </>
  )
}
