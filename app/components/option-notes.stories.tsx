import type { ComponentProps } from "react"
import { OptionNotes } from "./option-notes"

const props: ComponentProps<typeof OptionNotes> = {
  options: [
    {
      name: "پیک فروشنده",
      interactive: false,
      value: "4000 تومان",
      icon: { name: "delivery", color: "text" },
    },
    {
      name: "پیک فروشنده",
      interactive: false,
      value: "4000 تومان",
      icon: { name: "delivery", color: "text" },
    },
    {
      name: "پیک فروشنده",
      interactive: true,
      value: "4000 تومان",
      icon: { name: "delivery", color: "text" },
    },
  ],
}

export const OptionNotesDefault = () => {
  return <OptionNotes {...props}></OptionNotes>
}
