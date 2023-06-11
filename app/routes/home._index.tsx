import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"

const DEFAULT_CITY = "تهران"

export default function Home() {
  const [city, setCity] = useState(DEFAULT_CITY)

  useEffect(() => {
    const cityName = localStorage.getItem("city")

    if (cityName) setCity(cityName)
  })

  return (
    <>
      <Link to={`stores/${city}`}>Go To Stores</Link>
    </>
  )
}
