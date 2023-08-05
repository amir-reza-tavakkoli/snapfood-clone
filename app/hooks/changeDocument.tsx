import { useEffect, useState } from "react"

export function useChangeDocument() {
  const [title, setTitle] = useState({ title: "" })

  useEffect(() => {
    document.title = title.title
  }, [title])

  return { setTitle }
}
