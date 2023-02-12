import React from "react"
import classNames from "classnames"
import "bulma/css/bulma.css"
import "./ToDo.css"
import { useState } from "react"

type Props = {
  todo: {
    status: string
    text: string
    deadline: Date
  }
  onCheck: (todo: { status: string; text: string; deadline: Date }) => void
  onEdit: (todo: { status: string; text: string; deadline: Date }) => void
}

export const ToDo: React.FC<Props> = (props) => {
  // state作成
  const { todo, onCheck, onEdit } = props
  const [isEditing, setIsEditing] = React.useState(false)
  const [text, setText] = React.useState(todo.text)
  const [value, setValue] = useState(todo.text)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCheck({ ...todo, status: event.target.value })
  }

  const handleClick = () => {
    setIsEditing(true)
    setValue(todo.text)
  }
  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onEdit({ ...todo, text: value })
    setText(value)
    setValue("")
    setIsEditing(false)
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
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setText(value)
                setIsEditing(false)
              }
            }}
          />
        </form>
      ) : (
        <span
          className={classNames({
            "has-text-grey-light": todo.status === "2",
          })}
          onClick={handleClick}
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
      )}
    </label>
  )
}

export default ToDo
