import type { ComponentProps } from "react"
import { ImageItem } from "./image-item"

const imageItemProps: ComponentProps<typeof ImageItem> = {
  image:
    "https://cdn.snappfood.ir/uploads/images/tags/website_image_irani_1.jpg",
  type: "غذا",
  title: "ایرانی",
}

export const ImageItemDefault = () => {
  return <ImageItem {...imageItemProps}></ImageItem>
}

export const WithLongName = () => {
  const props = {
    ...imageItemProps,
    title:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  }
  return <ImageItem {...props}></ImageItem>
}

export const WithOverflowingName = () => {
  const props = {
    ...imageItemProps,
    title:
      "LoremIpsumissimplydummytextoftheprintingandtypesettingindustryLoremIpsumhasbeentheindustry'sstandarddummtexteversincethe1500s,whenanunknownprinter ookagalleyoftypeandscrambledittomakeatypejjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
  }
  return <ImageItem {...props}></ImageItem>
}

export const WithBadImage = () => {
  const props = { ...imageItemProps, image: "noSuchUrl.com" }
  return <ImageItem {...props}></ImageItem>
}

export const Constrained = () => {
  return (
    <div style={{ width: "500px" }}>
      <ImageItem {...imageItemProps}></ImageItem>
    </div>
  )
}
