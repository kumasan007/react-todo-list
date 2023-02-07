import classNames from "classnames"
import "bulma/css/bulma.css"
import "./ToDo.css"

type Props = {
  todo: {
    status: string
    text: string
    deadline: Date
  }
  onCheck: (todo: { status: string; text: string; deadline: Date }) => void
}

export const ToDo: React.FC<Props> = (props) => {
  // state作成
  const { todo, onCheck } = props

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCheck({ ...todo, status: event.target.value })
  }

  return (
    <label className="panel-block">
      <div className="select">
        <select value={todo.status} onChange={handleChange}>
          <option value="0">未着手</option>
          <option value="1">着手中</option>
          <option value="2">完了</option>
        </select>
      </div>
      <span
        className={classNames({
          "has-text-grey-light": todo.status === "2",
        })}
      >
        <div
          className="todo-text"
          style={{
            float: "left",
            display: "block",
            overflow: "hidden",
            wordBreak: "break-all",
            marginRight: "7rem",
          }}
        >
          {todo.text}
        </div>
        <div className="todo-deadline" style={{ float: "right" }}>
          {todo.deadline && todo.deadline.toString()}
        </div>
      </span>
    </label>
  )
}

export default ToDo
