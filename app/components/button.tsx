import { useEffect, useState } from "react"

import { type IconProps, Icon } from "./icon"

type DefaultButtonProps = JSX.IntrinsicElements["button"]

type CustomButtonProps = {
  icon?: IconProps
  rounding?: "normal" | "full"
  variant?: "primary" | "accent" | "faded"
  spining?: boolean
  reactTo?: Array<any>
}

type ButtonProps = CustomButtonProps & DefaultButtonProps

export const Button = ({
  icon,
  rounding = "normal",
  variant = "faded",
  children,
  spining = false,
  reactTo = [""],
  className: extraClassName,
  ...otherProps
}: ButtonProps) => {
  const [state, setstate] = useState<"responding" | "waiting">("responding")

  useEffect(() => {
    const delay = 250

    if (reactTo && spining) setTimeout(() => setstate("responding"), delay)
  }, [...reactTo])

  return (
    <button
      className={!extraClassName ? "button" : `button ${extraClassName}`}
      data-rounding={rounding}
      data-variant={variant}
      {...otherProps}
      onClick={(e) => {
        spining ? setstate("waiting") : null
        otherProps.onClick ? otherProps.onClick(e) : null
      }}
    >
      <span>{children}</span>

      {icon ? (
        <span>
          <Icon {...icon} />
        </span>
      ) : null}

      {state === "waiting" && spining ? (
        <Icon name="dots" color="primary" className="_dots"></Icon>
      ) : null}
    </button>
  )
}
