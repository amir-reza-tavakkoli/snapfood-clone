import { json } from "@remix-run/node"

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 })

export function generateVerificationCode(figures: number) {
  const mins = [1] // leat signifcant possible figure
  const maxs = [9] // most signifcant possible figure

  for (let index = 0; index < figures - 1; index++) {
    mins.push(0)
    maxs.push(9)
  }

  let min = Number(mins.join(""))
  let max = Number(maxs.join(""))

  min = Math.ceil(min)
  max = Math.floor(max)

  return String(Math.floor(Math.random() * (max - min) + min))
}

export function generateVerificationExpiry(mins: number): Date {
  const defaultMinutes = 4
  mins = mins ?? defaultMinutes

  return new Date(
    new Date(Date.now()).setMinutes(new Date(Date.now()).getMinutes() + mins),
  )
}
