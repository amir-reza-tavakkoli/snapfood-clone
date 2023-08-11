import { useEffect, useState } from "react"

import type { Address, Item, Order, Store } from "@prisma/client"

import { JoinedOrderItem } from "../constants"
import { calculateShipmentPrice } from "../utils/utils"

export function usePrices({
  items,
  store,
  totalPrice,
  address,
  storeAddress,
}: {
  items: JoinedOrderItem[]
  totalPrice?: number
  store: Store
  address?: Address | null
  storeAddress?: Address | null
}) {
  const [newTotalPrice, setNewTotalPrice] = useState(0)

  const [totalDiscount, setTotalDiscount] = useState(0)

  const [finalPrice, setFinalPrice] = useState(totalPrice ?? 0)

  const shipment =
    address && storeAddress
      ? calculateShipmentPrice({
          store,
          storeAddress,
          destinationAddress: address,
        })
      : store.baseShipmentPrice

  useEffect(() => {
    let tempPrice = items.reduce(
      (prev, item) => (item.price ?? 0) * (item.count ?? 0) + prev,
      0,
    )

    if (newTotalPrice !== tempPrice) setNewTotalPrice(tempPrice)

    tempPrice =
      ((newTotalPrice - totalDiscount + shipment + store.packagingPrice) *
        (100 + store.taxPercent)) /
      100

    if (finalPrice !== tempPrice) setFinalPrice(tempPrice)

    tempPrice = items.reduce(
      (prev, item) =>
        (item.price ?? 0) *
          (item.count ?? 0) *
          ((item.discountPercent ?? 0) / 100) +
        prev,
      0,
    )

    if (totalDiscount !== tempPrice) setTotalDiscount(tempPrice)
  })

  return {
    finalPrice,
    setFinalPrice,
    totalDiscount,
    setTotalDiscount,
    newTotalPrice,
    setNewTotalPrice,
  }
}
