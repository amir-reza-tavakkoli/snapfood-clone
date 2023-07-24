import { Form } from "@remix-run/react"
import { Icon } from "./icon"

export function FanBanner() {
  return (
    <article className="fan-banner">
      <div>
        <h1>اپلیکیشن اسنپ‌فود</h1>
        <p>
          با اپلیکیشن اسنپ‌فود به راحتی و با چند کلیک ساده می‌توانید رستوران‌ها،
          کافه‌ها، شیرینی‌فروشی‌ها و سوپرمارکت‌های نزدیک خودتان را جست‌و‌جو کرده
          و از تجربه سفارش آسان از اسنپ‌فود لذت ببرید.
        </p>
        <Form action="">
          <label htmlFor="__phoneNumber">
            برای دریافت لینک دانلود اپلیکیشن، شماره موبایلتان رو وارد کنید
          </label>
          <span className="_input">
            <input
              type="text"
              id="__phoneNumber"
              placeholder={Number("09").toLocaleString("fa-IR") + "*******"}
            />
            <button>دریافت لینک</button>
          </span>

          <ul>
            <li>
              <Icon name="iapps"></Icon>
            </li>
            <li>
              <Icon name="bazzar"></Icon>
            </li>
            <li>
              <Icon name="googleplay"></Icon>
            </li>
            <li>
              <Icon name="iapps"></Icon>
            </li>
          </ul>
        </Form>
      </div>
      <img
        src="https://snappfood.ir/static/images/img_app_mockup@2x.png"
        alt=""
        role="presentation"
      />
    </article>
  )
}
