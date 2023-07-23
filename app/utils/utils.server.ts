import { json } from "@remix-run/node"

import type { Store } from "@prisma/client"

import {
  getStoresByKind,
  getStoresKinds,
  getStoresWithDiscount,
  getStoresWithFreeShipment,
} from "../queries.server/store.query.server"

import { LoginFieldErrors } from "../routes/login"

import { AllowedStoresFeatures } from "../constants"


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

export function checkFieldsErrors(
  fieldErrors: LoginFieldErrors,
  state?: string,
) {
  if (Object.values(fieldErrors).some(Boolean)) {
    return {
      fieldErrors,
      state,
    }
  }
}

type Features = ({
  name: AllowedStoresFeatures
  getStores: ({
    kind,
    stores,
  }: {
    kind?: string
    stores: Store[]
  }) => Promise<Store[]>
  title?: string
})[]
export const features: Features = [
  {
    name: "kind",
    getStores: async ({ kind, stores }: { kind?: string; stores: Store[] }) => {
      const kinds = await getStoresKinds()

      if (!kind || kinds.find(storeKind => storeKind.name === kind))
        throw new Error("این نوع وجود ندارد.")

      const featureStores = await getStoresByKind({ kind })

      let kindFeature = features.find(feat => feat.name === "kind")

      if (kindFeature) kindFeature.title = kind

      return featureStores
    },
  },

  {
    name: "discount",
    title: "دارای تخفیف",
    getStores: async ({ stores }: { stores: Store[] }) => {
      const featureStores = await getStoresWithDiscount({ stores })

      if (!featureStores) {
        throw new Error("خطا")
      }

      return featureStores
    },
  },

  {
    name: "freeShipment",
    title: "دارای ارسال رایگان",
    getStores: async ({ stores }: { stores: Store[] }) => {
      const featureStores = await getStoresWithFreeShipment({ stores })
      if (!featureStores) {
        throw new Error("خطا")
      }

      return featureStores
    },
  },

  {
    name: "all",
    title: "همه فروشگاه ها",
    getStores: async ({ stores }: { stores: Store[] }) => {
      return stores
    },
  },
]
