import classNames from "classnames"
import "bulma/css/bulma.css"

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
        {todo.text}
        {todo.deadline && todo.deadline.toString()}
      </span>
    </label>
  )
}

export default ToDo
