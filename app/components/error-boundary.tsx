import { Link, useNavigate, useRouteError } from "@remix-run/react"

import { routes } from "../routes"

import { Icon } from "./icon"

export function GlobalErrorBoundary() {
  const error = useRouteError()

  const navigate = useNavigate()

  const errorMessage = error instanceof Error ? error.message : undefined
  const errorStack = error instanceof Error ? error.stack : undefined

  return (
    <output
      aria-label="error"
      role="alert"
      aria-live="assertive"
      className="boundary-error"
    >
      <h1>مشکلی پیش آمد!</h1>

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
