import { useEffect, useState } from "react"
import { Link, useNavigate } from "@remix-run/react"

export const DEFAULT_CITY = "تهران"

export default function Home() {
  const [city, setCity] = useState(DEFAULT_CITY)

  const navigate = useNavigate()

  useEffect(() => {
    const cityName = localStorage.getItem("city")

    if (cityName) {
      setCity(cityName)
      
    } else {
      setTimeout( () => navigate("/home/addresses"), 2000)

    }
  },[city])

  return (
    <>
      <Link to={`stores/${city}`}>Go To Stores</Link>
    </>
  )
}
