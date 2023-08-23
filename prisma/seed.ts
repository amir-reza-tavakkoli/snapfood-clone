import { PrismaClient } from "@prisma/client"

import type { Item } from "@prisma/client"

import { calculateOrder } from "../app/queries.server/order.query.server"

import {
  DEFAULT_COORDINATIONS,
  DEFAULT_SHIPMENT_RADIUS,
  DEFAULT_SHIPMENT_TIME,
  RESPONDED_BY,
} from "../app/constants"

const prisma = new PrismaClient()

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

async function seedFirstDataChunk() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09900249950",
      firstName: "امیر",
      lastName: "توکلی",
      email: "tavakkoli13@gmail.com",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09121234567",
      firstName: "احمد",
      lastName: "صادقی",
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address:
        "خیابان فرهنگ شهر، ایستگاه ۱۵، جنب کتلت آناهیتا، نبش کوچه ایمانی، کترینگ پرس",
      unit: 2,
      cityName: "شیراز",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "شیراز فرهنگ شهر کوچه 35",
      unit: 4,
      cityName: "شیراز",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
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
        estimatedReadyTime: 45,
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
        estimatedReadyTime: 45,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/63cb8ada4c81c.jpg",
        itemCategoryName: "ایرانی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "خوراک کباب شیشلیک با استخوان",
        description: `یک سیخ کباب شیشلیک گوشت دنده گوسفندی ۴۵۰ گرمی، دورچین: گوجه کبابی، فلفل کبابی، لیمو، یک عدد نان لواش`,
        basePrice: 355000,
        estimatedReadyTime: 75,
        itemCategoryName: "خوراک",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو خورشت قورمه سبزی",
        description: `۴۰۰ گرم خورشت قورمه، ۵ تکه گوشت گوسفندی، ۴۵۰ گرم برنج خارجی`,
        basePrice: 125000,
        estimatedReadyTime: 35,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/63cb878ed4727.jpg",
        itemCategoryName: "ایرانی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو میگو ویژه",
        description: `۳۰۰ گرم میگو، طعم دار شده با سس مخصوص، دوپیازه میگو، دورچین: لیمو، یک عدد نان لواش`,
        basePrice: 225000,
        estimatedReadyTime: 75,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d5543b4a75ae.jpg",
        itemCategoryName: "دریایی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو ماهی ویژه",
        description: `۳۰۰ گرم ماهی طعم دار شده با سس مخصوص، دوپیازه ماهی دورچین: لیمو، یک عدد نان لواش`,
        basePrice: 205000,
        estimatedReadyTime: 75,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d5543b4a75ae.jpg",
        itemCategoryName: "دریایی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "دوغ قوطی پارسی",
        description: "۳۳۰ میلی لیتر",
        basePrice: 8000,
        estimatedReadyTime: 5,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d4416dec86cf.jpg`,
        itemCategoryName: "نوشیدنی",
      },
    }),
  )

  const store = await prisma.store.create({
    data: {
      name: "کترینگ پُرس",
      avatarUrl:
        "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/5af96b9e32823.jpg",
      minOrderPrice: 20000,
      storeKindName: "رستوران",
      takesOfflineOrder: true,
      baseShipmentPrice: 5000,
      score: 4,
      scoreCount: 300,
      packagingPrice: 0,
      baseShipmentTime: 10,
      perUnitShipmentPrice: 1000,
      shipmentRadius: DEFAULT_SHIPMENT_RADIUS,
      cityName: storeAddress.cityName,
      addressId: storeAddress.id,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const startTime = 12
  const endTime = 24
  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  await Promise.all(
    daysNumber.map(day =>
      prisma.storeSchedule.create({
        data: { dayNumber: day, endTime, startTime, storeId: store.id },
      }),
    ),
  )

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice!,
          discountPercent: 10,
          score: 3,
          scoreCount: 300,
          remainingCount: 100,
          estimatedReadyTime: item.estimatedReadyTime,
        },
      }),
    ),
  )

  const order = await prisma.order.create({
    data: {
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      estimatedReadyTime: 90,
      shipmentPrice: 0,
      totalPrice: 0,
      billDate: new Date(Date.now()),
      isBilled: true,
      isDelivered: true,
      isShipped: true,
      estimatedShipmentTime: DEFAULT_SHIPMENT_TIME,
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

  const totalPrice = await calculateOrder({ orderId: order.id })

  const newOrder = await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  })

  const commentRespondedBy: RESPONDED_BY = "مدیر رستوران"

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      wasPositive: true,
      wasDeliveryPositive: true,
      score: 4,
      description: "بد نبود",
      response: "ممنون از نظر شما",
      responsedBy: commentRespondedBy,
    },
  })
}

async function seedSecondDataChunk() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09173196544",
      firstName: "رضا",
      email: "rrr@gmail.com",
      lastName: "حبیبی",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09825486201",
      firstName: "طاهره",
      lastName: "اسکندری",
      gender: true,
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address: "بلوار کسایی، انتهای دوستان، ایران برگر",
      unit: 1,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "سعادت آباد بولواراصلی",
      unit: 16,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
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
        estimatedReadyTime: 75,
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
        estimatedReadyTime: 45,
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
        estimatedReadyTime: 55,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/630dcf51c29db.jpeg`,
        itemCategoryName: "ساندویچ",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "فانتا قوطی",
        description: "۳۳۰ میلی لیتر",
        estimatedReadyTime: 5,
        basePrice: 19000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/63296e4b8b231.jpeg`,
        itemCategoryName: "نوشیدنی",
      },
    }),
  )

  const store = await prisma.store.create({
    data: {
      takesOfflineOrder: true,
      name: "ایران برگر",
      baseShipmentTime: 5,
      avatarUrl:
        "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/5eb257c8f0766.jpg",
      minOrderPrice: 80000,
      baseShipmentPrice: 5000,
      storeKindName: "رستوران",
      cityName: storeAddress.cityName,
      addressId: storeAddress.id,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const startTime = 12
  const endTime = 24
  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  await Promise.all(
    daysNumber.map(day =>
      prisma.storeSchedule.create({
        data: { dayNumber: day, endTime, startTime, storeId: store.id },
      }),
    ),
  )

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice!,
          score: 4,
          scoreCount: 70,
          remainingCount: 100,
          estimatedReadyTime: item.estimatedReadyTime,
        },
      }),
    ),
  )

  const order = await prisma.order.create({
    data: {
      estimatedShipmentTime: DEFAULT_SHIPMENT_TIME,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      estimatedReadyTime: 50,
      billDate: new Date(Date.now()),
      isBilled: true,
      isDelivered: true,
      isShipped: true,
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

  const totalPrice = await calculateOrder({ orderId: order.id })

  const newOrder = await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  })

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      wasPositive: true,
      wasDeliveryPositive: true,
      score: 5,
      description: "عالی",
    },
  })
}

async function seedThirdDataChunk() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09901234568",
      gender: true,
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09121231111",
      firstName: "Ahmad",
      lastName: "Saberi",
      gender: false,
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address: "شهرک اسلام خیابان بندر جنب بانک ملی",
      unit: 5,
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
      cityName: "شیراز",
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "شهرک اسلام کوچه 9",
      unit: 4,
      cityName: "شیراز",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
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
        estimatedReadyTime: 45,
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
        estimatedReadyTime: 45,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/63cb8ada4c81c.jpg",
        itemCategoryName: "ایرانی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "خوراک کباب شیشلیک با استخوان",
        description: `یک سیخ کباب شیشلیک گوشت دنده گوسفندی ۴۵۰ گرمی، دورچین: گوجه کبابی، فلفل کبابی، لیمو، یک عدد نان لواش`,
        basePrice: 355000,
        estimatedReadyTime: 75,
        itemCategoryName: "خوراک",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو خورشت قورمه سبزی",
        description: `۴۰۰ گرم خورشت قورمه، ۵ تکه گوشت گوسفندی، ۴۵۰ گرم برنج خارجی`,
        basePrice: 125000,
        estimatedReadyTime: 35,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/63cb878ed4727.jpg",
        itemCategoryName: "ایرانی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو میگو ویژه",
        description: `۳۰۰ گرم میگو، طعم دار شده با سس مخصوص، دوپیازه میگو، دورچین: لیمو، یک عدد نان لواش`,
        basePrice: 225000,
        estimatedReadyTime: 75,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d5543b4a75ae.jpg",
        itemCategoryName: "دریایی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "چلو ماهی ویژه",
        description: `۳۰۰ گرم ماهی طعم دار شده با سس مخصوص، دوپیازه ماهی دورچین: لیمو، یک عدد نان لواش`,
        basePrice: 205000,
        estimatedReadyTime: 75,
        avatarUrl:
          "https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d5543b4a75ae.jpg",
        itemCategoryName: "دریایی",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "دوغ قوطی پارسی",
        description: "۳۳۰ میلی لیتر",
        basePrice: 8000,
        estimatedReadyTime: 5,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/27/15/9/product_image/zoodfood/5d4416dec86cf.jpg`,
        itemCategoryName: "نوشیدنی",
      },
    }),
  )

  const store = await prisma.store.create({
    data: {
      name: "کترینگ پُرس",
      avatarUrl:
        "https://cdn.snappfood.ir/media/cache/vendor_logo/uploads/images/vendors/logos/5af96b9e32823.jpg",
      minOrderPrice: 20000,
      takesOfflineOrder: false,
      storeKindName: "رستوران",
      cityName: storeAddress.cityName,
      score: 4,
      scoreCount: 50,
      addressId: storeAddress.id,
      packagingPrice: 20000,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const startTime = 12
  const endTime = 24
  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  await Promise.all(
    daysNumber.map(day =>
      prisma.storeSchedule.create({
        data: { dayNumber: day, endTime, startTime, storeId: store.id },
      }),
    ),
  )

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice!,
          remainingCount: 500,
          score: 2,
          scoreCount: 3,
          infiniteSupply: true,
          estimatedReadyTime: item.estimatedReadyTime,
        },
      }),
    ),
  )

  const order = await prisma.order.create({
    data: {
      estimatedShipmentTime: DEFAULT_SHIPMENT_TIME,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      estimatedReadyTime: 55,
      billDate: new Date(Date.now()),
      isBilled: true,
      isDelivered: true,
      isShipped: true,
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

  const totalPrice = await calculateOrder({ orderId: order.id })

  const newOrder = await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  })

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      wasPositive: true,
      wasDeliveryPositive: false,
      score: 5,
      description: "عالییی",
    },
  })
}

async function seedForthDataChunk() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09173196666",
      firstName: "علی",

      lastName: "حبیبی",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09825486202",
      firstName: "طاهره",
      lastName: "اسکندری",
      gender: true,
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address: "بلوار نیشابور ، احمد برگر",
      unit: 1,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "سعادت آباد دوم بولواراصلی",
      unit: 16,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
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
        estimatedReadyTime: 75,
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
        estimatedReadyTime: 45,
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
        estimatedReadyTime: 55,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/630dcf51c29db.jpeg`,
        itemCategoryName: "ساندویچ",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "فانتا قوطی",
        description: "۳۳۰ میلی لیتر",
        estimatedReadyTime: 5,
        basePrice: 19000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/63296e4b8b231.jpeg`,
        itemCategoryName: "نوشیدنی",
      },
    }),
  )

  const store = await prisma.store.create({
    data: {
      takesOfflineOrder: true,
      name: "احمد برگر",
      baseShipmentTime: 5,
      avatarUrl:
        "https://cdn.snappfood.ir/300x200/uploads/images/vendors/covers/6488c57fd46ce.jpeg",
      minOrderPrice: 80000,
      baseShipmentPrice: 15000,
      storeKindName: "رستوران",
      score: 2.3,
      scoreCount: 81,
      cityName: storeAddress.cityName,
      addressId: storeAddress.id,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const startTime = 12
  const endTime = 24
  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  await Promise.all(
    daysNumber.map(day =>
      prisma.storeSchedule.create({
        data: { dayNumber: day, endTime, startTime, storeId: store.id },
      }),
    ),
  )

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          infiniteSupply: true,
          itemId: item.id,
          price: item.basePrice!,
          score: 2,
          scoreCount: 20,
          remainingCount: 100,
          estimatedReadyTime: item.estimatedReadyTime,
        },
      }),
    ),
  )

  const order = await prisma.order.create({
    data: {
      estimatedShipmentTime: DEFAULT_SHIPMENT_TIME,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      estimatedReadyTime: 50,
      billDate: new Date(Date.now()),
      isBilled: true,
      isDelivered: true,
      isShipped: true,
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

  const totalPrice = await calculateOrder({ orderId: order.id })

  const newOrder = await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  })

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      wasPositive: true,
      wasDeliveryPositive: true,
      score: 5,
      description: " نبود عالی",
    },
  })
}

async function seedّFifthDataChunk() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09173196667",
      firstName: "علی",

      lastName: "حبیبی",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09825486282",
      firstName: "طاهره",
      lastName: "اسکندری",
      gender: true,
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address: "گیشا خیابان دوم",
      unit: 1,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "سعادت آباد دوم بولواراصلی",
      unit: 16,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
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
        estimatedReadyTime: 75,
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
        estimatedReadyTime: 45,
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
        estimatedReadyTime: 55,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/630dcf51c29db.jpeg`,
        itemCategoryName: "ساندویچ",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "فانتا قوطی",
        description: "۳۳۰ میلی لیتر",
        estimatedReadyTime: 5,
        basePrice: 19000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/63296e4b8b231.jpeg`,
        itemCategoryName: "نوشیدنی",
      },
    }),
  )

  const store = await prisma.store.create({
    data: {
      takesOfflineOrder: true,
      name: "تهران بار",
      baseShipmentTime: 15,
      avatarUrl:
        "https://cdn.snappfood.ir/300x200/uploads/images/vendor-cover-app-review/16/08.jpg",
      minOrderPrice: 80000,
      baseShipmentPrice: 15000,
      packagingPrice: 10000,
      taxPercent: 10,
      storeKindName: "رستوران",
      cityName: storeAddress.cityName,
      score: 4,
      scoreCount: 6422,
      addressId: storeAddress.id,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const startTime = 12
  const endTime = 24
  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  await Promise.all(
    daysNumber.map(day =>
      prisma.storeSchedule.create({
        data: { dayNumber: day, endTime, startTime, storeId: store.id },
      }),
    ),
  )

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice!,
          score: 2,
          scoreCount: 20,
          remainingCount: 100,
          discountPercent: 50,
          infiniteSupply: true,
          estimatedReadyTime: item.estimatedReadyTime,
        },
      }),
    ),
  )

  const order = await prisma.order.create({
    data: {
      estimatedShipmentTime: DEFAULT_SHIPMENT_TIME,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      estimatedReadyTime: 50,
      billDate: new Date(Date.now()),
      isBilled: true,
      isDelivered: true,
      isShipped: true,
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

  const totalPrice = await calculateOrder({ orderId: order.id })

  const newOrder = await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  })

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      wasPositive: true,
      wasDeliveryPositive: true,
      score: 5,
      description: " نبود عالی",
    },
  })
}

async function seedّSixthDataChunk() {
  const user = await prisma.user.create({
    data: {
      phoneNumber: "09173726667",
      firstName: "علی",

      lastName: "شاهرخی",
      credit: 1000000,
    },
  })

  const storeOwner = await prisma.user.create({
    data: {
      phoneNumber: "09825666282",
      firstName: "اسکندر",
      lastName: "اسکندری",
      gender: true,
      credit: 1000000,
    },
  })

  const storeAddress = await prisma.address.create({
    data: {
      address: "گیشا خیابان دوم",
      unit: 1,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const userAddress = await prisma.address.create({
    data: {
      address: "سعادت آباد دوم بولواراصلی",
      unit: 16,
      cityName: "تهران",
      xAxis: DEFAULT_COORDINATIONS.xAxis,
      yAxis: DEFAULT_COORDINATIONS.yAxis,
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
        estimatedReadyTime: 75,
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
        estimatedReadyTime: 45,
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
        estimatedReadyTime: 55,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/630dcf51c29db.jpeg`,
        itemCategoryName: "ساندویچ",
      },
    }),
  )

  items.push(
    await prisma.item.create({
      data: {
        name: "فانتا قوطی",
        description: "۳۳۰ میلی لیتر",
        estimatedReadyTime: 5,
        basePrice: 19000,
        avatarUrl: `https://cdn.snappfood.ir/200x201/cdn/49/82/8/vendor/63296e4b8b231.jpeg`,
        itemCategoryName: "نوشیدنی",
      },
    }),
  )

  const store = await prisma.store.create({
    data: {
      takesOfflineOrder: true,
      name: "پنینی بار",
      baseShipmentTime: 15,
      avatarUrl:
        "https://cdn.snappfood.ir/300x200/uploads/images/vendor-cover-app-review/8/07.jpg",
      minOrderPrice: 80000,
      baseShipmentPrice: 15000,
      storeKindName: "رستوران",
      cityName: storeAddress.cityName,
      addressId: storeAddress.id,
      score: 4,
      scoreCount: 293,
      userPhoneNumber: storeOwner.phoneNumber,
    },
  })

  const startTime = 12
  const endTime = 24
  const daysNumber = [0, 1, 2, 3, 4, 5, 6]

  await Promise.all(
    daysNumber.map(day =>
      prisma.storeSchedule.create({
        data: { dayNumber: day, endTime, startTime, storeId: store.id },
      }),
    ),
  )

  const itemsInStore = await Promise.all(
    items.map(item =>
      prisma.storeHasItems.create({
        data: {
          storeId: store.id,
          itemId: item.id,
          price: item.basePrice!,
          score: 2,
          scoreCount: 20,
          infiniteSupply: true,
          remainingCount: 100,
          estimatedReadyTime: item.estimatedReadyTime,
        },
      }),
    ),
  )

  const order = await prisma.order.create({
    data: {
      estimatedShipmentTime: DEFAULT_SHIPMENT_TIME,
      storeId: store.id,
      userPhoneNumber: user.phoneNumber,
      addressId: userAddress.id,
      estimatedReadyTime: 50,
      billDate: new Date(Date.now()),
      isBilled: true,
      description: "بهتر باشه",
      isDelivered: true,
      isShipped: true,
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

  const totalPrice = await calculateOrder({ orderId: order.id })

  const newOrder = await prisma.order.update({
    where: { id: order.id },
    data: { totalPrice },
  })

  const comment = await prisma.comment.create({
    data: {
      orderId: order.id,
      wasPositive: true,
      wasDeliveryPositive: true,
      score: 5,
      description: " نبود عالی",
    },
  })
}

async function seedData() {
  await seedFirstDataChunk()
    .then(async () => {
      console.log("Seeded first chunk successfully")

      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)

      await prisma.$disconnect()

      process.exit(1)
    })

  await seedSecondDataChunk()
    .then(async () => {
      console.log("Seeded second chunk successfully")

      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)

      await prisma.$disconnect()

      process.exit(1)
    })

  await seedThirdDataChunk()
    .then(async () => {
      console.log("Seeded third chunk successfully")

      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)

      await prisma.$disconnect()

      process.exit(1)
    })

  await seedForthDataChunk()
    .then(async () => {
      console.log("Seeded forth chunk successfully")

      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)

      await prisma.$disconnect()

      process.exit(1)
    })

  await seedّFifthDataChunk()
    .then(async () => {
      console.log("Seeded fifth chunk successfully")

      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)

      await prisma.$disconnect()

      process.exit(1)
    })

  await seedّSixthDataChunk()
    .then(async () => {
      console.log("Seeded sixth chunk successfully")

      await prisma.$disconnect()
    })

    .catch(async e => {
      console.error(e)

      await prisma.$disconnect()

      process.exit(1)
    })
}

seedConstants()
  .then(async () => {
    await seedData()

    console.log("Seed compelete")

    await prisma.$disconnect()
  })

  .catch(async e => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
