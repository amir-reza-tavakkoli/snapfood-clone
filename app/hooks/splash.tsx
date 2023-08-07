import { useEffect, useState } from "react"

export function useSplash() {
  const [splash, setSplash] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setSplash(false)
    }, 1000)
  }, [])

  return { splash }
}
