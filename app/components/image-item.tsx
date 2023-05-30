import "./image-item.css"
import { Icon } from "./icon"

export type ImageItemProps = {
  title: string
  type?: string
  image: string
}

export const ImageItem = ({ title, image, type }: ImageItemProps) => {
  return (
    <article className="image-item" aria-label={type ?? undefined}>
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
