import {
  isRouteErrorResponse,
  Link,
  useNavigate,
  useRouteError,
} from "@remix-run/react"
import { Button } from "./button"

export function GlobalErrorBoundary() {
  const error = useRouteError()

  const navigate = useNavigate()

  const errorMessage = error instanceof Error ? error.message : undefined

  if (isRouteErrorResponse(error)) {
    return (
      <div className="boundary-error" aria-label="error">
        <h1>مشکلی پیش آمد!</h1>

        <Button type="button" onClick={() => navigate(".", { replace: true })}>
          دوباره امتحان کنید
        </Button>
      </div>
    )
  }

  return (
    <div
      aria-label="error"
      role="alert"
      aria-live="assertive"
      className="boundary-error"
    >
      <h1>مشکلی پیش آمد!</h1>

      {errorMessage ? <p>{errorMessage}</p> : null}

      <Link to="/">بازگشت به خانه</Link>

      <Button variant="primary" type="button" onClick={() => navigate(".", { replace: true })}>
        دوباره امتحان کنید
      </Button>
    </div>
  )
}
