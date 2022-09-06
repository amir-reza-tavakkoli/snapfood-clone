import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      {
        firstName: "امیر",
        lastName: "توکلی",
        email: "ahmad-tavakoli@gmail.com",
        address: "شیراز فرهنگ شهر کوچه 35 کوچه 5",
      },
      {
        firstName: "احمد",
        lastName: "توکلی",
        email: "ahmad-tavakoli@gmail.com",
        address: "قزوین ساختمان شهرداری",
      },
      {
        firstName: "عباس",
        lastName: "شرابی نابی",
        email: "saghi@hotmail.com",
        address: "کرمان خیابان تاکستان کوچه کشمش ",
      },
    ],
  })

  // await prisma.foodType.createMany({
  //   data: [
  //     { name: "فست فود", description: "آماده سریع" },
  //     { name: "رستوران", description: "مختلف" },
  //     { name: "کباب", description: "گوشتی" },
  //     { name: "ایرانی", description: "سنتی" },
  //     { name: "میوه", description: "مرکبات" },
  //     { name: "کافه", description: "قهوه" },
  //     { name: "بستنی فروشی", description: "بستنی" },
  //     { name: "محلی", description: "محلی" },
  //     { name: "خشکبار", description: "آجیل" },
  //     { name: "پروتِین فروشی", description: "گوشت" },
  //     { name: "نانوایی", description: "نان" },
  //   ],
  // })

  await prisma.foodType.createMany({
    data: [
      {
        name: "رستوران",
        descriptor: "رستورانی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_1_603508bf202d8_img_st_food.png",
      },
      {
        name: "سوپرمارکت",
        descriptor: "سوپری",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_4_603508a14ab73_img_st_supermarket.png",
      },
      {
        name: "کافه",
        descriptor: "کافه",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_2_603508b330711_img_st_cafe.png",
      },
      {
        name: "شیرینی",
        descriptor: "شیرینی قروشی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_3_603508a95b9be_img_st_sweet.png",
      },
      {
        name: "میوه",
        descriptor: "میوه فروشی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_6_6035088cbcde4_img_st_fruit.png",
      },
      {
        name: "نان",
        descriptor: "نانوایی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_5_60350898c61b5_img_st_bakery.png",
      },
      {
        name: " آبمیوه و بستنی",
        descriptor: "بستنی . آبمیوه فروشی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_8_6035087b463a3_img_st_icecream.png",
      },
      {
        name: "پروتعین",
        descriptor: "پروتعین فروشی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_11_603507afc9a32_img_st_meat.png",
      },
      { name: "محلی", descriptor: "محصولات محلی" },
      {
        name: "آجیل",
        descriptor: "خشکبار",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/review-app/icons/count/desktop_7_60350883d6e43_img_st_nut.png",
      },
      { name: "فست فود", descriptor: "فست فودی" },
      { name: "ساندویچ", descriptor: "ساندویچی" },
      { name: "پیتزا", descriptor: "پیتزا فروشی" },
      { name: "خورشت", descriptor: "سنتی" },
      { name: "پیش غذا" },
      { name: "سوخاری", descriptor: "سوخاری" },
      { name: "سنتی", descriptor: "سنتی" },
      { name: "برگر", descriptor: "برگری" },
      { name: "نوشیدنی" },
      { name: "", descriptor: "" },
    ],
  })

  await prisma.store.createMany({
    data: [
      {
        name: "رستوران طوبی",
        address: "شیراز فرهنگ شهر",
        registrationNumber: "12345679",
        avatarUrl:
          "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/59fb1a2537df6.jpg",
        orderCapacity: 500,
        currentDiscount: 0,
        minOrderPrice: "50000",
        active: true,
        delivery: "اسنپ اکسپرس",
      },
      {
        name: "سرزمین سوخاری",
        address: "شیراز مطهری خیابان 2",
        registrationNumber: "13613434",
        avatarUrl:
          "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/628396c17afdf.jpg",
        orderCapacity: 500,
        currentDiscount: 0,
        minOrderPrice: 300000,
        active: true,
        delivery: "پیک فروشنده",
      },
      {
        name: "خانه هات داگ",
        address: "شیراز فلکه گاز",
        registrationNumber: "18643222",
        avatarUrl:
          "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/5af96b9e32823.jpg",
        orderCapacity: 500,
        currentDiscount: 10,
        minOrderPrice: 750000,
        active: true,
        delivery: "اسنپ اکسپرس",
      },
    ],
  })

  await prisma.food.create({
    data: {
      name: "چلو خورشت فسنجون",
      avatarUrl:
        "https://cdn.snappfood.ir/300x200/uploads/images/vendor-cover-app-review/2/13.jpg",
      ingredients: "گردو - سبزی - لیمو - برنج",
      score: 4.3,
      basePrice: 69000,
    },
  })
  prisma.food.create({
    data: {
      name: "چلو گردن",
      avatarUrl:
        "https://cdn.snappfood.ir/200x201/cdn/21/63/20/vendor/61dd5ed94e61a.jpeg",
      ingredients: "برنج - گوشت گردن - پیاز کاراملی",
      score: 2.2,
      basePrice: 95000,
      foodTypes: {
        create: [],
      },
    },
  })
  prisma.food.create({
    data: {
      name: "پیتزا ایتالیایی",
      avatarUrl:
        "https://cdn.snappfood.ir/200x201/cdn/26/04/63/vendor/62e95c2cefbe8.jpeg",
      ingredients: "نان - استیک - پنیر - سس",
      score: 4,
      basePrice: 40000,
    },
  })
  prisma.food.create({
    data: {
      name: "نوشابه فانتا",
      avatarUrl:
        "https://cdn.snappfood.ir/200x201/cdn/26/04/63/product_image/zoodfood/62e6471198cac.jpg",
      ingredients: "",
      score: 1.7,
      basePrice: 4200,
    },
  })

  prisma.food.create({
    data: {
      name: "هات داگ مخصوص",
      avatarUrl:
        "https://cdn.snappfood.ir/641x641/cdn/26/04/63/vendor/62eacec46785c.jpeg",
      ingredients: "هات داگ - نان - سس - پنیر",
      score: 3.7,
      basePrice: 55500,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
