import { PropsWithChildren } from "react"

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"

import { GlobalErrorBoundary } from "./components/error-boundary"

import { DEAFULT_DIRECTION } from "./constants"

import baseCss from "./index.css"
import errorBoundaryCss from "./components/styles/error-boundary.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: baseCss },
  { rel: "stylesheet", href: errorBoundaryCss },
  {
    rel: "favicon",
    href: "https://snappfood.ir/static/images/favicon/favicon-96x96.png",
  },
]

export const meta: V2_MetaFunction = () => {
  const description = "Order food and have it delivered to you!"

  return [
    { name: "description", content: description },
    { name: "twitter:description", content: description },
    { title: "SnappFood Clone" },
  ]
}

export default function App({
  children,
  title,
}: PropsWithChildren<{ title?: string }>) {
  return (
    <html lang="fa" dir={DEAFULT_DIRECTION}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="keywords" content="Snapp,snappfood,food,delivery," />
        <meta
          name="twitter:image"
          content="https://i.postimg.cc/vmpWHbmJ/vendor-img-big.png"
        />
        <meta name="twitter:creator" content="Amir Reza Tavakkoli" />
        <meta name="twitter:site" content="@remix_run" />
        <meta name="twitter:title" content="SnappFood Clone" />
        <Meta />
        {title ? <title>{title}</title> : null}
        <link rel="preload" href="./IRANSans.woff2" as="font" />
        <link rel="canonical" href="https://snappfood.ir"></link>
        <Links />
        <link
          rel="icon"
          href="https://snappfood.ir/static/images/favicon/favicon-96x96.png"
        ></link>
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export const ErrorBoundary = GlobalErrorBoundary
