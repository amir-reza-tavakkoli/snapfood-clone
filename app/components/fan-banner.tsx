import { Form } from "@remix-run/react"

import { routes } from "~/routes"

import { Icon } from "./icon"

export function FanBanner() {
  return (
    <article className="fan-banner">
      <div aria-label="About">
        <h1>اپلیکیشن اسنپ‌فود</h1>

        <p>
          با اپلیکیشن اسنپ‌فود به راحتی و با چند کلیک ساده می‌توانید رستوران‌ها،
          کافه‌ها، شیرینی‌فروشی‌ها و سوپرمارکت‌های نزدیک خودتان را جست‌و‌جو کرده
          و از تجربه سفارش آسان از اسنپ‌فود لذت ببرید.
        </p>

        <Form action={routes.notImplemented}>
          <label htmlFor="__phoneNumber">
            برای دریافت لینک دانلود اپلیکیشن، شماره موبایلتان رو وارد کنید
          </label>

          <span className="_input">
            <input
              type="text"
              id="__phoneNumber"
              placeholder={"۰" + Number("9").toLocaleString("fa-IR") + "*******"}
            />

            <button type="submit">دریافت لینک</button>
          </span>

          <ul>
            <p className="nonvisual">On social media</p>

            <li>
              <span className="nonvisual">Iapps</span>

             <a href={routes.notImplemented}>  <Icon name="iapps"></Icon> </a>
            </li>

            <li>
              <span className="nonvisual">Bazzar</span>

              <a href={routes.notImplemented}> <Icon name="bazzar"></Icon> </a>
            </li>

            <li>
              <span className="nonvisual">Googleplay</span>

              <a href={routes.notImplemented}> <Icon name="googleplay"></Icon> </a>
            </li>

            <li>
              <span className="nonvisual">Iapps</span>

              <a href={routes.notImplemented}> <Icon name="iapps"></Icon> </a>
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
