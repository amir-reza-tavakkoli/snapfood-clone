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

export function replaceAll(string: string, rip : string) {
  const regex = new RegExp(`/${rip}/g`)

  return string.replace(regex, "")
}

