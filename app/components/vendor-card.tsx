import "./vendor-card.css"
import { Icon } from "./icon"

export type VendorCardProps = {
  name: string
  image: string
  type?: string
  logo?: string
  rating?: {
    value?: number | string
    range?: number
    count?: number
  }
  discount?: number
  tags?: string[]
  delivery: {
    method: string
    price?: {
      value?: number
      currency?: string
    }
  }
}

export const VendorCard = ({
  name,
  logo,
  image,
  rating,
  type,
  discount,
  tags,
  delivery,
}: VendorCardProps) => {
  return (
    <dl className="vendor-card">
      <dt className="nonvisual">Name</dt>
      <dd className="_name">{name ?? null}</dd>

      {type ? (
        <>
          <dt className="nonvisual">Type</dt>
          <dd className="nonvisual">{type}</dd>{" "}
        </>
      ) : null}

      {tags ? (
        <>
          <dt className="nonvisual">Categories</dt>
          <dd>
            <ol className="_categories">
              {tags.map((tag, index, array) =>
                index === array.length - 1 ? (
                  <li key={index}>{tag}</li>
                ) : (
                  <li key={index}>{`${tag}, `}</li>
                ),
              )}
            </ol>
          </dd>
        </>
      ) : null}

      <div className="_images">
        <dt className="nonvisual">Image</dt>
        <dd className="_image">
          {<img src={image} alt={`${name}  ${type}`} /> ?? null}
          {logo ? (
            <span className="_logo" role="presentation">
              <img src={logo} alt="" role="presentation" />
            </span>
          ) : null}
        </dd>

        {discount ? (
          <>
            <dt className="nonvisual">Discount</dt>
            <dd className="_discount">{` ${discount}%`}</dd>
          </>
        ) : null}
      </div>

      {rating ? (
        <>
          <dt className="nonvisual">Rating</dt>
          <dd className="_rating">
            <dl>
              <dt className="nonvisual">Stars</dt>
              <dd className="_star-icon">
                {<Icon name="star" role="presentation" />}
              </dd>
              {rating.value ? (
                <>
                  <dt className="nonvisual">Value</dt>
                  <dd aria-label="Stars">{rating.value}</dd>{" "}
                </>
              ) : null}
              {rating.range ? (
                <>
                  <dd className="nonvisual">Range</dd>
                  <dt className="nonvisual">/ {rating.range}</dt>
                </>
              ) : null}
              {rating.count ? (
                <>
                  <dt className="nonvisual">Count</dt>
                  <dd className="_rating-count">( {rating.count} )</dd>{" "}
                </>
              ) : null}
            </dl>
          </dd>
        </>
      ) : null}

      {delivery ? (
        <>
          <dt className="nonvisual">Delivery</dt>
          <dd>
            <dl>
              {delivery.price && delivery.method ? (
                <>
                  <dt className="nonvisual">Method / Price:</dt>
                  <dd className="_delivery">
                    <Icon name="delivery" role="presentation" />
                    <div>
                      <span>{delivery.method} </span>
                      <span>{delivery.price.value ?? null} </span>
                      <span>{delivery.price.currency ?? null}</span>
                    </div>
                  </dd>
                  <dt className="nonvisual">Currency</dt>
                </>
              ) : (
                <>
                  <dt className="nonvisual">Method</dt>
                  <dd className="_delivery faded">
                    <Icon name="remainingTime" role="presentation" />
                    <span>{delivery.method ?? null}</span>
                  </dd>
                </>
              )}
            </dl>
          </dd>
        </>
      ) : null}
    </dl>
  )
}
