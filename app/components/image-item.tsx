import { DEFAULT_IMG_PLACEHOLDER } from "../constants"
import { Icon } from "./icon"

type ImageItemProps = {
  title: string
  type?: string
  image?: string
  dir?: "rtl" | "lrt"
}

export const ImageItem = ({
  title,
  image,
  type = "Category",
  dir,
}: ImageItemProps) => {
  return (
    <div className="image-item" aria-label={type} dir={dir}>
      <img
        src={image ?? DEFAULT_IMG_PLACEHOLDER}
        alt=""
        role="presentation"
        loading="lazy"
        width={160}
        height={80}
      />

      {title ? (
        <p>
          {title}

          <span role="presentation">
            <Icon name="flash" color="accent" role="presentation" />
          </span>
        </p>
      ) : null}
    </div>
  )
}
