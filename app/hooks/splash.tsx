import { useEffect, useState } from "react"

export function useSplash() {
  const [splash, setSplash] = useState(
    typeof window !== "undefined" ? !!localStorage.getItem("splash") : true,
  )

  useEffect(() => {
    setTimeout(() => {
      localStorage.setItem("splash", "true")
      setSplash(false)
    }, 1000)
  }, [])

  return { splash }
}
