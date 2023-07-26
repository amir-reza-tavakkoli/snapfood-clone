export function toPersianDay(day: number) {
  switch (day) {
    case 0:
      return "یکشنبه"

    case 1:
      return "دوشنبه"

    case 2:
      return "سه شنبه"

    case 3:
      return "چهارشنبه"

    case 4:
      return "پنج شنبه"

    case 5:
      return "جمعه"

    default:
      return "شنبه"
  }
}

export function toPersianMonth(month: number) {
  month--
  switch (month) {
    case 0:
      return "فروردین"

    case 1:
      return "اردیبهشت"

    case 2:
      return "خرداد"

    case 3:
      return "تیر"

    case 4:
      return "مرداد"

    case 5:
      return "شهریور"

    case 6:
      return "مهر"

    case 7:
      return "آبان"

    case 8:
      return "آذر"

    case 9:
      return "دی"

    case 10:
      return "بهمن"

    default:
      return "اسفند"
  }
}


// function linksHierarchy() {
//   const location = useLocation().pathname
//   const splits = location.split("/")
//   const hierarchy: string[] = []

//   splits.forEach(split => {
//     if (
//       split === "home" ||
//       split === "stores" ||
//       split === "orders" ||
//       split === "orders-summary" ||
//       split === "cart" ||
//       split === "bill"
//     ) {
//       hierarchy.push(split)
//     }
//   })

//   // console.log(hierarchy)

//   return hierarchy
// }

export function replaceAll(string: string, rip: string) {
  const regex = new RegExp(`/${rip}/g`)

  return string.replace(regex, "")
}

export function getFormattedDate(date: Date) {
  const x = date.toLocaleDateString("fa").split("/")

  const p2e = (s: any) =>
    s.replace(/[۰-۹]/g, (d: any) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))

  return x[0] + toPersianMonth(Number(p2e(x[1]))) + x[2]
}

export function setChosenAddress({
  addressId,
  setAddressId,
  cityName,
  setHomeAddressState,
}: {
  addressId: number
  setAddressId: React.Dispatch<React.SetStateAction<number>>
  cityName: string
  setHomeAddressState: any
}) {
  try {
    localStorage.setItem("addressId", addressId.toString())
    localStorage.setItem("city", cityName.toString())
    setHomeAddressState()
    setAddressId(addressId)
  } catch (error) {
    throw error
  }
}
