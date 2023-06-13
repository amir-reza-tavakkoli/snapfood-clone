import type { Item } from "@prisma/client"

import { PrismaClient } from "@prisma/client"
import { getStoreCategories } from "./../app/utils/store.query.server"

const prisma = new PrismaClient()

async function constants() {
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
      { name: "ساری", latinName: "sari" },
      { name: "زنجان", latinName: "zanjan" },
      { name: "کرمانشاه", latinName: "" },
      { name: "گرگان", latinName: "" },
      { name: "اسلامشهر", latinName: "" },
      { name: "شهر ری", latinName: "" },
      { name: "اراک", latinName: "" },
      { name: "بوشهر", latinName: "" },
      { name: "بندرعباس", latinName: "" },
      { name: "بجنورد", latinName: "" },
      { name: "شاهین شهر", latinName: "" },
      { name: "خرم آباد", latinName: "" },
      { name: "مرودشت", latinName: "" },
      { name: "کاشان", latinName: "" },
      { name: "نیشابور", latinName: "" },
      { name: "یاسوج", latinName: "" },
      { name: "بابل", latinName: "" },
      { name: "دزفول", latinName: "" },
      { name: "نجف آباد", latinName: "" },
      { name: "بابلسر", latinName: "" },
      { name: "سنندج", latinName: "" },
      { name: "قائم‌ شهر", latinName: "" },
      { name: "پردیس", latinName: "" },
      { name: "بیرجند", latinName: "" },
      { name: "آبادان", latinName: "" },
      { name: "ورامین", latinName: "" },
      { name: "آمل", latinName: "" },
      { name: "لاهیجان", latinName: "" },
      { name: "مراغه", latinName: "" },
      { name: "سبزوار", latinName: "" },
      { name: "خمینی شهر", latinName: "" },
      { name: "گنبد کاووس", latinName: "" },
      { name: "کیش", latinName: "" },
      { name: "شهریار", latinName: "" },
      { name: "پاکدشت", latinName: "" },
      { name: "زاهدان", latinName: "" },
      { name: "اندیمشک", latinName: "" },
      { name: "سمنان", latinName: "" },
      { name: "تربت حیدریه", latinName: "" },
      { name: "شاهرود", latinName: "" },
      { name: "سپاهان شهر", latinName: "" },
      { name: "شهرکرد", latinName: "" },
      { name: "ساوه", latinName: "" },
      { name: "رباط کریم", latinName: "" },
      { name: "بندر انزلی", latinName: "" },
      { name: "پرند", latinName: "" },
      { name: "شهر قدس", latinName: "" },
      { name: "اندیشه", latinName: "" },
      { name: "بروجرد", latinName: "" },
      { name: "ایلام", latinName: "" },
      { name: "هشتگرد", latinName: "" },
      { name: "لنگرود", latinName: "" },
      { name: "مرند", latinName: "" },
      { name: "قرچک", latinName: "" },
      { name: "نسیم شهر", latinName: "" },
      { name: "صدرا", latinName: "" },
      { name: "بهارستان", latinName: "" },
      { name: "محمود آباد", latinName: "" },
      { name: "لواسان", latinName: "" },
      { name: "فولادشهر", latinName: "" },
      { name: "نوشهر", latinName: "" },
      { name: "بومهن", latinName: "" },
      { name: "سلمان شهر", latinName: "" },
      { name: "دماوند", latinName: "" },
      { name: "سهند", latinName: "" },
      { name: "رودهن", latinName: "" },
      { name: "چالوس", latinName: "" },
      { name: "قوچان", latinName: "" },
      { name: "رامسر", latinName: "" },
      { name: "گرمدره", latinName: "" },
      { name: "کازرون", latinName: "" },
      { name: "نور", latinName: "" },
      { name: "سرخ رود", latinName: "" },
      { name: "درود", latinName: "" },
      { name: "تنکابن", latinName: "" },
      { name: "فریدونکنار", latinName: "" },
      { name: "بهشهر", latinName: "" },
      { name: "شهرضا", latinName: "" },
      { name: "مبارکه", latinName: "" },
      { name: "خوی", latinName: "" },
      { name: "ملارد", latinName: "" },
      { name: "خرمشهر", latinName: "" },
      { name: "زرین شهر", latinName: "" },
      { name: "داراب", latinName: "" },
      { name: "ملایر", latinName: "" },
      { name: "قشم", latinName: "" },
      { name: "رویان", latinName: "" },
      { name: "بروجن", latinName: "" },
      { name: "سیرجان", latinName: "" },
      { name: "میاندوآب", latinName: "" },
      { name: "فلاورجان", latinName: "" },
      { name: "لار", latinName: "" },
      { name: "رفسنجان", latinName: "" },
      { name: "مارلیک", latinName: "" },
      { name: "ایزدشهر", latinName: "" },
      { name: "فومن", latinName: "" },
      { name: "نکا", latinName: "" },
      { name: "تربت جام", latinName: "" },
      { name: "آران بیدگل", latinName: "" },
      { name: "کلارآباد", latinName: "" },
      { name: "بم", latinName: "" },
      { name: "فسا", latinName: "" },
      { name: "ماسال", latinName: "" },
      { name: "صومعه سرا", latinName: "" },
      { name: "زابل", latinName: "" },
      { name: "طرقبه", latinName: "" },
      { name: "میبد", latinName: "" },
      { name: "باقر شهر", latinName: "" },
      { name: "خمین", latinName: "" },
      { name: "گرمسار", latinName: "" },
      { name: "رودسر", latinName: "" },
      { name: "سنگر", latinName: "" },
      { name: "سراب", latinName: "" },
      { name: "چهارمحال بختیاری", latinName: "" },
      { name: "طبس", latinName: "" },
      { name: "شیرگاه", latinName: "" },
      { name: "نقده", latinName: "" },
      { name: "تفت", latinName: "" },
      { name: "جاجرود", latinName: "" },
      { name: "چابهار", latinName: "" },
    ],
  })

  await prisma.itemCategory.createMany({
    data: [
      {
        name: "ایرانی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_irani_1.jpg",
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
      },
      {
        name: "پیتزا",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_pizza_1.jpg",
      },
      {
        name: "برگر",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_burger_1.jpg",
      },
      {
        name: "ساندویچ",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_sandwich_1.jpg",
      },
      {
        name: "سوخاری",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_sokhari_1.jpg",
      },
      {
        name: "پاستا",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_italy_1.jpg",
      },
      {
        name: "سالاد",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_salad_1.jpg",
      },
      {
        name: "دریایی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_seafood_1.jpg",
      },
      {
        name: "بین الملل",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_asian_1.jpg",
      },
      {
        name: "گیلانی",
        avatarUrl:
          "https://cdn.snappfood.ir/uploads/images/tags/website_image_gilani_1.jpg",
      },
      {
        name: "نوشیدنی",
      },
    ],
  })
}

async function seedFirstStore() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09900249950",
      firstName: "Amir",
      lastName: "Tavakkoli",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09121234567",
      firstName: "Ahmad",
      lastName: "Sadeghi",
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address:
        "خیابان فرهنگ شهر، ایستگاه ۱۵، جنب کتلت آناهیتا، نبش کوچه ایمانی، کترینگ پرس",
      unit: 2,
      cityName: "شیراز",
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "شیراز فرهنگ شهر کوچه 35",
      unit: 4,
      cityName: "شیراز",
      userPhoneNumber: user.phoneNumber,
    },
  })

  let items: Item[] = []

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو جوجه کباب زعفرانی",
        description:
          "یک سیخ جوجه کباب زعفرانی، ۲۶۰ گرم برنج خارجی، دورچین: گوجه کبابی، فلفل کبابی، لیمو، کره",
        basePrice: 175000,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/63cb855bcb2ec.jpg",
        itemCategoryName: "ایرانی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "زرشک پلو با مرغ",
        description: `یک عدد ران مرغ ۴۰۰ گرمی سس پز، ۴۵۰ گرم برنج خارجی، دورچین: لیموترش`,
        basePrice: 155000,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/63cb8ada4c81c.jpg",
        itemCategoryName: "ایرانی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "دوغ قوطی پارسی",
        description: "۳۳۰ میلی لیتر",
        basePrice: 8000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d4416dec86cf.jpg`,
        itemCategoryName: "نوشیدنی",
      },
      // {name:"", description:"", basePrice:,avatarUrl:"",},
    }),
  )

  const store = await prisma.store.create({
    data: {
      name: "کترینگ پُرس",
      avatarUrl:
        "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/5af96b9e32823.jpg",
      minOrderPrice: 20000,
      storeKindId: "رستوران",
      cityName: storeAddress.cityName,
      addressId: storeAddress.id,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice!,
          remainingCount: 100,
        },
      }),
    ),
  )

  const storeCategories = await getStoreCategories({ storeId: store.id })

  await prisma.storeHasItemCategories.createMany({
    data: storeCategories.map(category => {
      return { storeId: store.id, itemCategoryName: category }
    }),
  })

  const order = await prisma.order.create({
    data: {
      packagingPrice: 0,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      taxPercent: 0,
      estimatedDeliveryTime: 90,
      shipmentPrice: 0,
      totalPrice: 0,
    },
  })

  const itemsInOrder = await Promise.all(
    items.map(item =>
      prisma.orderHasItems.create({
        data: {
          count: 1,
          itemId: item.id,
          orderId: order.id,
        },
      }),
    ),
  )

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      isPositive: true,
      score: 4,
      description: "بد نبود",
    },
  })
}

async function seedSecondStore() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09173196544",
      firstName: "Reza",
      lastName: "Habibi",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09825486201",
      firstName: "Ghader",
      lastName: "Eskandari",
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address: "بلوار کسایی، انتهای دوستان، ایران برگر",
      unit: 1,
      cityName: "تهران",
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "سعادت آباد بولواراصلی",
      unit: 16,
      cityName: "تهران",
      userPhoneNumber: user.phoneNumber,
    },
  })

  let items: Item[] = []

  items.push(
    await prisma.item.create({
      data: {
        name: "چوریتسو برگر",
        description:
          "گوشت گوساله خالص ،گردو، سوسیس چوریتسو،پنیرورقه ای، قارچ، نان مک دونالد",
        basePrice: 220000,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/6329709095616.jpeg",
        itemCategoryName: "برگر",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "فیله استریپس (چهار تکه)",
        description: `۴ تکه فیله سوخاری، سیب زمینی سرخ شده، سالاد کلم، نان بروتچن`,
        basePrice: 305000,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/63296fbdb7975.jpeg",
        itemCategoryName: "فست فود",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "ساندویچ برگر تنوری سینگل",
        description: `برگر دست ساز گوشت گوساله خالص ، میکس پنیر پیتزا، چیپس، سس قارچ، نان باگت فرانسوی`,
        basePrice: 180000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/630dcf51c29db.jpeg`,
        itemCategoryName: "ساندویچ",
      },
      // {name:"", description:"", basePrice:,avatarUrl:"",},
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "فانتا قوطی",
        description: "۳۳۰ میلی لیتر",
        basePrice: 19000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/63296e4b8b231.jpeg`,
        itemCategoryName: "نوشیدنی",
      },
      // {name:"", description:"", basePrice:,avatarUrl:"",},
    }),
  )

  const store = await prisma.store.create({
    data: {
      name: "ایران برگر",
      avatarUrl:
        "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/5eb257c8f0766.jpg",
      minOrderPrice: 80000,
      storeKindId: "رستوران",
      cityName: storeAddress.cityName,
      addressId: storeAddress.id,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice ?? 0,
          remainingCount: 100,
        },
      }),
    ),
  )

  const storeCategories = await getStoreCategories({ storeId: store.id })

  await prisma.storeHasItemCategories.createMany({
    data: storeCategories.map(category => {
      return { storeId: store.id, itemCategoryName: category }
    }),
  })

  const order = await prisma.order.create({
    data: {
      packagingPrice: 10000,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      taxPercent: 0,
      estimatedDeliveryTime: 50,
      shipmentPrice: 3000,
      totalPrice: 0,
    },
  })

  const itemsInOrder = await Promise.all(
    items.map(item =>
      prisma.orderHasItems.create({
        data: {
          count: 1,
          itemId: item.id,
          orderId: order.id,
        },
      }),
    ),
  )

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      isPositive: true,
      score: 5,
      description: "عالی",
    },
  })
}

constants()
  .then(async () => {
    await seed()
    await prisma.$disconnect()
  })

  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function seed() {
  await seedFirstStore()
    .then(async () => {
      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })

  await seedSecondStore()
    .then(async () => {
      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    })
}
