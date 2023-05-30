import { Header } from "./header"

const props = {
  address:
    "شیراز فرهنگ شهر کوچه ۳۵ کوچه ۵ بولوار اندیشه فرعی  ۵ ممیز ۴ ساختمان ساناز واحد ۴",
  about: "foods",
}

export const HeaderDefault = () => {
  return <Header {...props}></Header>
}
