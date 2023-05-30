import { Icon } from "./icon"
import { Button } from "./button"
import "./store-card.css"

type StoreCardProps = {
  name: string
  logo?: string
  type?: string
  rating?: {
    value?: number | string
    range?: number
    count?: number
  }
}

export const StoreCard = ({ name, logo, type, rating }: StoreCardProps) => {
  return (
    <dl className="store-card">
      <div>
        <dt className="nonvisual">Store</dt>
        <dd className="_identity">
          <dl>
            <dt className="nonvisual">Name</dt>
            <dd className="_name">{name}</dd>
            <dt className="nonvisual">Type</dt>
            <dd className="nonvisual">{type}</dd>
            {rating ? (
              <>
                <dt className="nonvisual">Rating</dt>
                <dd className="_rating">
                  <dl>
                    <dt className="nonvisual">Starts</dt>
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
                        <dd className="_rating-count">
                          ( {rating.count} نظر)
                        </dd>{" "}
                      </>
                    ) : null}
                  </dl>
                </dd>
              </>
            ) : null}
          </dl>
        </dd>
        <dt className="nonvisual">Images</dt>
        <dd className="_image">
          <dl>
            <dt className="nonvisual">Logo</dt>
            <dd>
              <img
                alt=""
                role="presentation"
                src={
                  logo ?? "https://snappfood.ir/static/images/placeholder.png"
                }
              ></img>
            </dd>
          </dl>
        </dd>
      </div>
      <div>
        <dt className="nonvisual">Information</dt>
        <dd>
          <Button
            variant="primary"
            type="button"
            rounding="full"
            icon={{ name: "info", color: "action" }}
          >
            اطلاعات و نظرات
          </Button>
        </dd>
      </div>
    </dl>
  )
}
