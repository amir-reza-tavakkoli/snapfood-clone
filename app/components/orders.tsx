import { Button } from "./button"

type OrderProps = {
  orders: { name: string; date: Date; logo: string; time?: string }[]
  dir? : "ltr" | "rtl"
}

export const Orders = ({ orders, dir }: OrderProps) => {
  console.log(orders);

  return (
    <article className="orders" aria-describedby="__orders" dir={dir}>
      <p id="__orders">سفارش های پیشین</p>
      <ol>
        {orders.map((item, index) => (
          <li
            data-last={orders.length - 1 == index ? true : undefined}
            aria-label="order"
          >
            <div>
              <img src={item.logo} alt="" role="presentation" />
              <div className="_identity">
                <p>{item.name}</p>
                <time className="_datetime">
                  {item.date.toLocaleString("fa-IR")}{" "}
                  <span className="_space">&nbsp;</span>
                  {item.time}
                </time>
              </div>
            </div>
            <div className="_comment">
              <p>
                <span> نظرتان را درباره این سفارش به اشتراک بگذارید</span>
                <button type="button">ثبت نظر</button>
              </p>
            </div>
            <span className="_buttons">
              <Button
                variant="faded"
                icon={{ name: "info", color: "text" }}
                type="button"
              >
                مشاهده فاکتور
              </Button>
              <Button
                variant="faded"
                icon={{ name: "info", color: "text" }}
                type="button"
              >
                سفارش مجدد
              </Button>
            </span>
          </li>
        ))}
      </ol>
      {/* <Button
        variant="primary"
        icon={{ name: "search", color: "action" }}
        rounding="full"
        type="button"
      >
        {" "}
        مشاهده همه سفارش ها
      </Button> */}
    </article>
  )
}
