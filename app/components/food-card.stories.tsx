import type { ComponentProps } from "react"
import { FoodCard } from "./food-card"

const props: ComponentProps<typeof FoodCard> = {
  name: "پیتزا استیک",
  type: "غذا",
  ingredients: ["گوشت خوک مرینت شده", "پنیر گودا", "سس ناپولی", "ریحان"],
  available: true,
  image:
    "https://cdn.snappfood.ir/641x641/cdn/71/82/3/vendor/62b604a15b978.jpeg",
  prices: [
    {
      variation: "بزرگ",
      vaule: 70000,
      currency: "تومان",
      available: true,
    },
    {
      variation: "کوچک",
      vaule: 55000,
      currency: "تومان",
      available: true,
    },
  ],
}

export const FoodCardDefault = () => {
  return <FoodCard {...props}></FoodCard>
}

export const LongIngerdients = () => {
  const longIngredients: ComponentProps<typeof FoodCard> = {
    ...props,
    ingredients: [
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
    ],
  }
  return <FoodCard {...longIngredients}></FoodCard>
}

export const LongIngerdientsConstrained = () => {
  const longIngredients: ComponentProps<typeof FoodCard> = {
    ...props,
    ingredients: [
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
      "گوشت خوک مرینت شده",
      "پنیر گودا",
      "سس ناپولی",
      "ریحان",
    ],
  }
  return (
    <div style={{ width: "300px", height: "250px" }}>
      {" "}
      <FoodCard {...longIngredients}></FoodCard>
    </div>
  )
}

export const BadImage = () => {
  const longIngredients: ComponentProps<typeof FoodCard> = {
    ...props,
    image: "NoSuchUrl.com",
  }
  return <FoodCard {...longIngredients}></FoodCard>
}

export const SmallConstrained = () => {
  return (
    <div style={{ width: "300px", height: "250px" }}>
      <FoodCard {...props}></FoodCard>
    </div>
  )
}

export const MediumConstrained = () => {
  return (
    <div style={{ width: "500px", height: "40px" }}>
      <FoodCard {...props}></FoodCard>
    </div>
  )
}
