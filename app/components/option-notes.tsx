import type { ComponentProps } from "react"
import { Icon } from "./icon"
import "./option-notes.css"

type OptionNotesProps = {
  options: {
    name: string
    value: string
    interactive: boolean
    icon: ComponentProps<typeof Icon>
  }[]
}

export const OptionNotes = ({ options }: OptionNotesProps) => {
  return (
    <dl className="options-card">
      <dt className="nonvisual">Options</dt>
      <dd>
        <dl>
          {options.map((item, index) =>
            item.interactive ? (
              <div key={index} data-interactive aria-label="Option">
                {<Icon name={item.icon.name} color={item.icon.color} />}
                <dt>{item.name}</dt>
                <dd>{item.value}</dd>
                <button type="button">
                  {<Icon name="flash" color="action" />}{" "}
                  <span className="nonvisual">Change</span>
                </button>
              </div>
            ) : (
              <div key={index} aria-label="Note">
                {<Icon name={item.icon.name} color={item.icon.color} />}
                <dt>{item.name}</dt>
                <dd>{item.value}</dd>
              </div>
            ),
          )}
        </dl>
      </dd>
    </dl>
  )
}
