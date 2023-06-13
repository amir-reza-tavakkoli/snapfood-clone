import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { getUserByPhone } from "./user.query.server"

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set")
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "SF_SESSION",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"))
}

export async function getPhoneNumber(request: Request) {
  const session = await getUserSession(request)
  const phoneNumber = session.get("phoneNumber")

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
  const phoneNumber = session.get("phoneNumber")

  if (!phoneNumber || typeof phoneNumber !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }

  return phoneNumber
}

export async function createUserSession(
  phoneNumber: string,
  redirectTo: string,
) {
  const session = await storage.getSession()
  session.set("phoneNumber", phoneNumber)

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  })
}

export async function logout(request: Request) {
  const session = await getUserSession(request)

  session.unset("phoneNumber")
  session.unset("SF_SESSION")

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  })
}

export async function getUser(request: Request) {
  const phoneNumber = await getPhoneNumber(request)

  if (typeof phoneNumber !== "string" || !phoneNumber) {
    return null
  }

  const user = await getUserByPhone({ phoneNumber })
  if (!user) {
    throw logout(request)
  }

  return user
}
