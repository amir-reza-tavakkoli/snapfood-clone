import { Icon } from "./icon"

type VendorCardProps = {
  name: string
  image: string
  type?: string
  logo?: string
  ratingValue?: number | string
  ratingRange?: number
  ratingCount?: number
  discount?: number
  tags?: string[]
  deliveryMethod: string
  deliveryPrice: string | number
  deliveryCurrency: string
  dir?: "lrt" | "rtl"
}

export const VendorCard = ({
  name,
  logo,
  image,
  ratingRange,
  ratingValue,
  ratingCount,
  deliveryMethod,
  type,
  discount,
  tags,
  deliveryCurrency,
  deliveryPrice,
  dir,
}: VendorCardProps) => {
  return (
    <dl className="vendor-card" dir={dir}>
      <dt className="nonvisual">Name</dt>

      <dd className="_name">{name ?? null}</dd>

      {type ? (
        <>
          <dt className="nonvisual">Type</dt>

          <dd className="nonvisual">{type}</dd>
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
              <img src={logo} alt="" role="presentation" loading="lazy" />
            </span>
          ) : null}
        </dd>

        {discount ? (
          <>
            <dt className="nonvisual">Discount</dt>

            <dd className="_discount">{` ${discount.toLocaleString(
              "fa",
            )}%`}</dd>
          </>
        ) : null}
      </div>

      {ratingValue ? (
        <>
          <dt className="nonvisual">Rating</dt>

          <dd className="_rating">
            <dl>
              <dt className="nonvisual">Stars</dt>

              <dd className="_star-icon">
                {<Icon name="star" role="presentation" />}
              </dd>

              {ratingValue ? (
                <>
                  <dt className="nonvisual">Value</dt>

                  <dd aria-label="Stars">{ratingValue.toLocaleString("fa")}</dd>
                </>
              ) : null}
              {ratingRange ? (
                <>
                  <dd className="nonvisual">Range</dd>

                  <dt className="nonvisual">
                    / {ratingRange.toLocaleString("fa")}
                  </dt>
                </>
              ) : null}
              {ratingCount ? (
                <>
                  <dt className="nonvisual">Count</dt>

                  <dd className="_rating-count">
                    ( {ratingCount.toLocaleString("fa")} )
                  </dd>
                </>
              ) : null}
            </dl>
          </dd>
        </>
      ) : null}

      {deliveryMethod ? (
        <>
          <dt className="nonvisual">Delivery</dt>

          <dd>
            <dl>
              {deliveryPrice && deliveryMethod ? (
                <>
                  <dt className="nonvisual">Method / Price:</dt>

                  <dd className="_delivery">
                    <Icon name="delivery" role="presentation" />

                    <div>
                      <span>{deliveryMethod} </span>

                      <span>
                        {deliveryPrice
                          ? deliveryPrice.toLocaleString("fa")
                          : "رایگان"}
                      </span>

                      <span>{deliveryCurrency ?? null}</span>
                    </div>
                  </dd>

                  <dt className="nonvisual">Currency</dt>
                </>
              ) : (
                <>
                  <dt className="nonvisual">Method</dt>

                  <dd className="_delivery faded">
                    <Icon name="remainingTime" role="presentation" />

                    <span>{deliveryMethod ?? null}</span>
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
