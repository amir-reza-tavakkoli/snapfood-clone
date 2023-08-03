import { Icon } from "./icon"

import { getFormattedDate } from "~/utils/utils"

import { StoreComment } from "~/constants"

type CommentProps = {
  comment: StoreComment
  index: number
}

export function CommentComp({ index, comment }: CommentProps) {
  return comment ? (
    <li key={index} className="_comment">
      <div>
        <span className="_name"> {comment.user?.firstName}</span>

        <span className="_score">
          {comment.comment?.score.toLocaleString("fa")}

          <Icon name="star"></Icon>
        </span>

        <time dateTime={`${comment.order?.billDate}`}>
          {comment.order.billDate
            ? getFormattedDate(new Date(comment?.order?.billDate))
            : null}
        </time>
      </div>

      <div>
        <span className="_description">{comment!.comment.description}</span>

        <ul>
          {comment && comment.items
            ? comment.items.map((item, index) =>
                item ? (
                  <li className="_item" key={index}>
                    {item?.name}
                  </li>
                ) : null,
              )
            : null}
        </ul>
      </div>
    </li>
  ) : null
}
