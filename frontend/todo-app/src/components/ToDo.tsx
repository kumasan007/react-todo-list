import classNames from "classnames"
import "bulma/css/bulma.css"
import "./ToDo.css"

export const ToDo = (props) => {
  // state作成
  const { todo, onCheck } = props

  const handleChange = (event) => {
    onCheck({ ...todo, status: event.target.value })
  }

  return (
    <label className="panel-block">
      <div className="select">
        <select value={todo.status} onChange={handleChange}>
          <option value="NOTSTARTED">未着手</option>
          <option value="INPROGRESS">着手中</option>
          <option value="DONE">完了</option>
        </select>
      </div>
      <span
        className={classNames({
          "has-text-grey-light": todo.status === "DONE",
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
