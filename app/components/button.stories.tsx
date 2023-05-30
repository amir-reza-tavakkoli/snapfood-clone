import { Button } from "./button"

export const DefaultVariant = () => <Button>Faded</Button>

export const FadedVariant = () => <Button variant="faded">انصراف</Button>

export const AccentVariant = () => <Button variant="accent">انصراف</Button>

export const PrimaryVariant = () => <Button variant="primary">انصراف</Button>

export const WithIconAndConstrained = () => (
  <div style={{ inlineSize: "40px" }}>
    <Button icon={{ name: "user", color: "text" }} variant="accent">
      Offers
    </Button>
  </div>
)

export const PrimaryWithIcon = () => (
  <div style={{ inlineSize: "80px" }}>
    <Button icon={{ name: "user", color: "text" }} variant="primary">
      Offers
    </Button>
  </div>
)

export const AccentWithIconConstrainedRTL = () => (
  <div style={{ inlineSize: "40px" }}>
    <Button
      icon={{ name: "user", color: "primary" }}
      dir="rtl"
      variant="accent"
    >
      ثبت سفارش
    </Button>
  </div>
)

export const Disabled = () => (
  <div style={{ inlineSize: "40px" }}>
    <Button
      disabled={true}
      icon={{ name: "user", color: "primary" }}
      dir="rtl"
      variant="accent"
    >
      ثبت سفارش
    </Button>
  </div>
)

export const AccentConstrainedIcon = () => (
  <div style={{ inlineSize: "280px" }}>
    <Button dir="rtl" icon={{ name: "user", color: "text" }} variant="accent">
      ورود به حساب کاربری
    </Button>
  </div>
)

export const WithRounding = () => (
  <div style={{ inlineSize: "40px" }}>
    <Button
      icon={{ name: "search", color: "primary" }}
      variant="accent"
      rounding="full"
    >
      سفارش
    </Button>
  </div>
)

export const FadedConstrained = () => (
  <div style={{ width: "40px" }}>
    <Button dir="rtl" icon={{ name: "user", color: "text" }} variant="faded">
      سفارش
    </Button>
  </div>
)

export const WithOverflow = () => (
  <div style={{ width: "40px" }}>
    <Button icon={{ name: "user", color: "text" }} variant="faded">
      JjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjJjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjJjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj
    </Button>
  </div>
)
