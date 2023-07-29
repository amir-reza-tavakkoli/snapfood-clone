import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { routes } from "../routes"

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}

const authCookieName = "SF_SESSION"
const phoneCookieName = "phoneNumber"

const oneMonth = 60 * 60 * 24 * 30

const storage = createCookieSessionStorage({
  cookie: {
    name: authCookieName,
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: routes.index,
    maxAge: oneMonth,
    httpOnly: true,
  },
})

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function getPhoneNumber(request: Request) {
  const session = await getUserSession(request)

  const phoneNumber = session.get(phoneCookieName)

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return null
  }

  return phoneNumber
}

export async function requirePhoneNumber(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const session = await getUserSession(request)

  const phoneNumber = session.get(phoneCookieName)

  if (!phoneNumber || typeof phoneNumber !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])

    throw redirect(routes.login + `?${searchParams}`)
  }

  return phoneNumber
}

export async function createUserSession(
  phoneNumber: string,
  redirectTo: string,
) {
  const session = await storage.getSession()

  session.set(phoneCookieName, phoneNumber)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  })
}

export async function logout(request: Request) {
  const session = await getUserSession(request)

  session.unset(phoneCookieName)
  session.unset(authCookieName)

  return redirect(routes.login, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  })
}
