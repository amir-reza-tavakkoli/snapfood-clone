import type { ComponentProps } from "react"
import { VendorCard } from "./vendor-card"

const overflowingText =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ"

const persianProps: ComponentProps<typeof VendorCard> = {
  name: "نان قندی و یوخه پزی چهار فصل",
  type: "رستوران",
  logo: "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/623209826af52.jpg",
  image: "https://cdn.snappfood.ir/300x200/cdn/vendor_sub_types/7/01.jpg",
  rating: {
    value: 3.6,
    count: 12366,
    range: 5,
  },
  tags: ["کباب", "ایرانی", "خورشت"],
  discount: 12,
  delivery: {
    method: "پیک فروشنده",
    price: {
      value: 7000,
      currency: "تومان",
    },
  },
}

const englishProps: ComponentProps<typeof VendorCard> = {
  name: "Mac & Cheese Center",
  type: "Restaurant",
  logo: "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/623209826af52.jpg",
  image: "https://cdn.snappfood.ir/300x200/cdn/vendor_sub_types/7/01.jpg",
  rating: {
    value: 4.7,
    count: 54,
    range: 5,
  },
  tags: ["burgur", "Pizza", "Pasta"],
  discount: 5,
  delivery: {
    method: "expeess delivery",
    price: {
      value: 1.5,
      currency: "USD",
    },
  },
}

export const DefaultCard = () => {
  return <VendorCard {...englishProps}></VendorCard>
}

export const WithBadImage = () => {
  const props = { ...persianProps, image: "noSuchImage.com" }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutRating = () => {
  const props = { ...persianProps, rating: undefined }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutRatingCount = () => {
  const props = {
    ...persianProps,
    rating: {
      value: 3.6,
    },
  }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutRatingValue = () => {
  const props = {
    ...persianProps,
    rating: {
      count: 3600,
    },
  }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutLogo = () => {
  const props = { ...persianProps, logo: undefined }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutTags = () => {
  const props = { ...persianProps, tags: undefined }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutDiscount = () => {
  const props = { ...persianProps, discount: undefined }
  return <VendorCard {...props}></VendorCard>
}

export const WithTagsOverflow = () => {
  const props = {
    ...persianProps,
    tags: [overflowingText],
  }
  return <VendorCard {...props}></VendorCard>
}

export const WithLongName = () => {
  const props = {
    ...persianProps,
    name: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  }
  return <VendorCard {...props}></VendorCard>
}

export const WithOverflowingName = () => {
  const props = {
    ...persianProps,
    name: overflowingText,
  }
  return <VendorCard {...props}></VendorCard>
}

export const WithOverflowingDeliveryText = () => {
  const props = {
    ...persianProps,
    delivery: {
      method: overflowingText,
    },
  }
  return <VendorCard {...props}></VendorCard>
}

export const WithoutDeliveryPrice = () => {
  const props = {
    ...persianProps,
    delivery: {
      method: "پیش سفارش",
    },
  }
  return <VendorCard {...props}></VendorCard>
}

export const Constrained = () => {
  return (
    <div style={{ width: "350px" }}>
      <VendorCard {...persianProps}></VendorCard>
    </div>
  )
}

export const ConstrainedRTL = () => {
  return (
    <div dir="rtl" style={{ width: "350px" }}>
      <VendorCard {...persianProps}></VendorCard>
    </div>
  )
}
