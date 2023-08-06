import { PrismaClient } from "@prisma/client"

import type { Item } from "@prisma/client"

import { calculateOrder } from "./../queries.server/order.query.server"

import {
  DEFAULT_COORDINATIONS,
  DEFAULT_SHIPMENT_RADIUS,
  DEFAULT_SHIPMENT_TIME,
  RESPONDED_BY,
} from "./../constants"
import { LoaderArgs } from "@remix-run/server-runtime"

const prisma = new PrismaClient()
export const loader = async ({ request }: LoaderArgs) => {
  async function seedConstants() {
    await prisma.storeKind.createMany({
      data: [
        {
          name: "رستوران",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_1_603508bf202d8_img_st_food.png",
        },
        {
          name: "شیرینی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_3_603508a95b9be_img_st_sweet.png",
        },
        {
          name: "سوپر مارکت",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_4_603508a14ab73_img_st_supermarket.png",
        },
        {
          name: "میوه",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_6_6035088cbcde4_img_st_fruit.png",
        },
        {
          name: "کافه",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_2_603508b330711_img_st_cafe.png",
        },
        {
          name: "آبمیوه بستنی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_8_6035087b463a3_img_st_icecream.png",
        },
        {
          name: "آجیل",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_7_60350883d6e43_img_st_nut.png",
        },
        {
          name: "پروتِین فروشی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_11_603507afc9a32_img_st_meat.png",
        },
        {
          name: "نانوایی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_5_60350898c61b5_img_st_bakery.png",
        },
        {
          name: "سایر",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_9_603b811b1d540_img_st_other2.png",
        },
      ],
    })

    await prisma.city.createMany({
      data: [
        { name: "تهران", latinName: "tehran" },
        { name: "مشهد", latinName: "mashad" },
        { name: "کرج", latinName: "karaj" },
        { name: "اصفهان", latinName: "isfahan" },
        { name: "شیراز", latinName: "shiraz" },
        { name: "تبریز", latinName: "tabriz" },
        { name: "قم", latinName: "qom" },
        { name: "اهواز", latinName: "ahvaz" },
        { name: "رشت", latinName: "rasht" },
        { name: "ارومیه", latinName: "urumie" },
        { name: "یزد", latinName: "yaz" },
        { name: "قزوین", latinName: "qazvin" },
        { name: "کرمان", latinName: "kerman" },
        { name: "همدان", latinName: "hamedan" },
        { name: "اردبیل", latinName: "ardabil" },
        { name: "ساری" },
        { name: "زنجان" },
        { name: "کرمانشاه" },
        { name: "گرگان" },
        { name: "اسلامشهر" },
        { name: "شهر ری" },
        { name: "اراک" },
        { name: "بوشهر" },
        { name: "بندرعباس" },
        { name: "بجنورد" },
        { name: "شاهین شهر" },
        { name: "خرم آباد" },
        { name: "مرودشت" },
        { name: "کاشان" },
        { name: "نیشابور" },
        { name: "یاسوج" },
        { name: "بابل" },
        { name: "دزفول" },
        { name: "نجف آباد" },
        { name: "بابلسر" },
        { name: "سنندج" },
        { name: "قائم‌ شهر" },
        { name: "پردیس" },
        { name: "بیرجند" },
        { name: "آبادان" },
        { name: "ورامین" },
        { name: "آمل" },
        { name: "لاهیجان" },
        { name: "مراغه" },
        { name: "سبزوار" },
        { name: "خمینی شهر" },
        { name: "گنبد کاووس" },
        { name: "کیش" },
        { name: "شهریار" },
        { name: "پاکدشت" },
        { name: "زاهدان" },
        { name: "اندیمشک" },
        { name: "سمنان" },
        { name: "تربت حیدریه" },
        { name: "شاهرود" },
        { name: "سپاهان شهر" },
        { name: "شهرکرد" },
        { name: "ساوه" },
        { name: "رباط کریم" },
        { name: "بندر انزلی" },
        { name: "پرند" },
        { name: "شهر قدس" },
        { name: "اندیشه" },
        { name: "بروجرد" },
        { name: "ایلام" },
        { name: "هشتگرد" },
        { name: "لنگرود" },
        { name: "مرند" },
        { name: "قرچک" },
        { name: "نسیم شهر" },
        { name: "صدرا" },
        { name: "بهارستان" },
        { name: "محمود آباد" },
        { name: "لواسان" },
        { name: "فولادشهر" },
        { name: "نوشهر" },
        { name: "بومهن" },
        { name: "سلمان شهر" },
        { name: "دماوند" },
        { name: "سهند" },
        { name: "رودهن" },
        { name: "چالوس" },
        { name: "قوچان" },
        { name: "رامسر" },
        { name: "گرمدره" },
        { name: "کازرون" },
        { name: "نور" },
        { name: "سرخ رود" },
        { name: "درود" },
        { name: "تنکابن" },
        { name: "فریدونکنار" },
        { name: "بهشهر" },
        { name: "شهرضا" },
        { name: "مبارکه" },
        { name: "خوی" },
        { name: "ملارد" },
        { name: "خرمشهر" },
        { name: "زرین شهر" },
        { name: "داراب" },
        { name: "ملایر" },
        { name: "قشم" },
        { name: "رویان" },
        { name: "بروجن" },
        { name: "سیرجان" },
        { name: "میاندوآب" },
        { name: "فلاورجان" },
        { name: "لار" },
        { name: "رفسنجان" },
        { name: "مارلیک" },
        { name: "ایزدشهر" },
        { name: "فومن" },
        { name: "نکا" },
        { name: "تربت جام" },
        { name: "آران بیدگل" },
        { name: "کلارآباد" },
        { name: "بم" },
        { name: "فسا" },
        { name: "ماسال" },
        { name: "صومعه سرا" },
        { name: "زابل" },
        { name: "طرقبه" },
        { name: "میبد" },
        { name: "باقر شهر" },
        { name: "خمین" },
        { name: "گرمسار" },
        { name: "رودسر" },
        { name: "سنگر" },
        { name: "سراب" },
        { name: "چهارمحال بختیاری" },
        { name: "طبس" },
        { name: "شیرگاه" },
        { name: "نقده" },
        { name: "تفت" },
        { name: "جاجرود" },
        { name: "چابهار" },
      ],
    })

    await prisma.itemCategory.createMany({
      data: [
        {
          name: "ایرانی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_irani_1.jpg",
          isMain: true,
        },
        {
          name: "فست فود",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_fastfood_1.jpg",
        },
        {
          name: "کباب",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_kebab_1.jpg",
          isMain: true,
        },
        {
          name: "پیتزا",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_pizza_1.jpg",
          isMain: true,
        },
        {
          name: "برگر",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_burger_1.jpg",
          isMain: true,
        },
        {
          name: "ساندویچ",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_sandwich_1.jpg",
          isMain: true,
        },
        {
          name: "سوخاری",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_sokhari_1.jpg",
          isMain: true,
        },
        {
          name: "پاستا",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_italy_1.jpg",
          isMain: true,
        },
        {
          name: "سالاد",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_salad_1.jpg",
          isMain: true,
        },
        {
          name: "دریایی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_seafood_1.jpg",
          isMain: true,
        },
        {
          name: "بین الملل",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_asian_1.jpg",
          isMain: true,
        },
        {
          name: "گیلانی",
          avatarUrl:
            "https://cdn.snappfood.ir/uploads/images/tags/website_image_gilani_1.jpg",
          isMain: true,
        },
        {
          name: "نوشیدنی",
        },
        {
          name: "خوراک",
        },
        {
          name: "ویژه",
        },
      ],
    })
  }

  await seedConstants()

  return null
}

export default function LoginPage() {
  return <p>ghgh</p>
}
