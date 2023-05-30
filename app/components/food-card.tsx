import { Button } from "./button"
import "./food-card.css"

type FoodCardProps = {
  name: string
  type: string
  ingredients?: string[]
  available: boolean
  image?: string
  prices?: {
    variation?: string
    vaule: number
    currency: string
    available: boolean
  }[]
}

export const FoodCard = ({
  name,
  type,
  image,
  ingredients,
  prices,
  available,
}: FoodCardProps) => {
  return (
    <dl className="food-card">
      <div>
        <dt className="nonvisual">Item</dt>
        <dl className="_identity">
          <dt className="nonvisual">Name</dt>
          <dd className="_name">{name}</dd>
          <dt className="nonvisual">Type</dt>
          <dd className="nonvisual">{type}</dd>
          {ingredients ? (
            <>
              <dt className="nonvisual">Ingredients</dt>
              <dd className="_ingredients">
                <ul>
                  {ingredients.map((item, index) => (
                    <li key={index}>
                      {item} {index !== ingredients.length - 1 ? ", " : " "}
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          ) : null}
        </dl>
        <img
          src={image ?? "https://snappfood.ir/static/images/placeholder.png"}
          alt=""
          role="presentation"
        />
      </div>
      {prices!.map((item, index) => (
        <div>
          {item ? (
            <>
              <dt className="nonvisual">Price</dt>
              <dd>
                <dl className="_price">
                  <dt className="nonvisual">Variation</dt>
                  <dd className="_variation">{item.variation}</dd>
                  <div>
                    <dt className="nonvisual">Value</dt>
                    <dd>{item.vaule}</dd>
                    <dt className="nonvisual">Currency</dt>
                    <dd>{item.currency}</dd>
                  </div>
                </dl>
              </dd>
            </>
          ) : null}
          <dt className="nonvisual">Add</dt>
          <dd>
            {available && item.available ? (
              <Button
                variant="primary"
                rounding="full"
                aria-label={"Add" + name + item.variation}
              >
                افزودن
              </Button>
            ) : (
              <Button
                disabled
                variant="primary"
                rounding="full"
                aria-label="Not available"
              >
                افزودن
              </Button>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}
