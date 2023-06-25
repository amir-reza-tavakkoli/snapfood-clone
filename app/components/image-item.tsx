import { Icon } from "./icon"

export type ImageItemProps = {
  title: string
  type?: string
  image: string
  dir?: "rtl" | "lrt"
}

export const ImageItem = ({
  title,
  image,
  type = "Category",
  dir,
}: ImageItemProps) => {
  return (
    <article className="image-item" aria-label={type ?? undefined} dir={dir}>
      <img src={image} alt="" role="presentation" />
      <p>
        {title}
        <span role="presentation">
          <Icon name="flash" color="accent" role="presentation" />
        </span>
      </p>
    </article>
  )
}
