import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "@remix-run/react"

import { Icon } from "./icon"

import { routes } from "../routes"
import { useEffect } from "react"

export function GlobalErrorBoundary() {
  const error = useRouteError()

  const errorMessage = error instanceof Error ? error.message : undefined

  const errorStack = error instanceof Error ? error.stack : undefined

  const navigate = useNavigate()

  useEffect(() => {
    document ? (document.title = "Error Snappfood Clone" + errorMessage) : null
  }, [])

  return (
    <output
      aria-label="error"
      role="alert"
      aria-live="assertive"
      className="boundary-error"
    >
      <h1>مشکلی پیش آمد!</h1>

      {isRouteErrorResponse(error) ? <p>{error?.data}</p> : null}

      {isRouteErrorResponse(error) ? (
        <p>{error.status.toLocaleString("fa")} خطای </p>
      ) : null}

      {errorMessage ? <p>{errorMessage}</p> : null}

      <br />

      {errorStack ? <p>{errorStack}</p> : null}

      <Link to={routes.index}>
        <Icon name="flash" color="text"></Icon> بازگشت به خانه
      </Link>

      <button type="button" onClick={() => navigate(".", { replace: true })}>
        دوباره امتحان کنید
      </button>
    </output>
  )
}
