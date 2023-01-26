import React, { useState } from "react"
import "bulma/css/bulma.css"
import InputToDo from "./InputToDo"
import Filter from "./Filter"
import ToDo from "./ToDo"
// import { InputToDo, Filter, ToDo } from "./index"

export const ToDoApp = () => {
  const getKey = () => Math.random().toString(32).substring(2)

  // stateを作成
  const [todos, setToDos] = useState([])
  const [filter, setFilter] = useState("ALL")

  // 入力値をtodos(配列)に設定
  const handleAdd = (text, deadline) => {
    setToDos([
      ...todos,
      { key: getKey(), text, deadline, status: "NOTSTARTED" },
    ])
  }

  // フィルターの切り替え
  const handleFilterChange = (value) => setFilter(value)

  // フィルターに応じたToDoを表示
  const displayToDos = todos.filter((todo) => {
    if (todo.deadline) {
      todo.status = "DEADLINE"
    }
    if (filter === "ALL") return todo
    if (filter === "NOTSTARTED") return todo.status === "NOTSTARTED"
    if (filter === "DEADLINE") return todo.status === "DEADLINE"
    if (filter === "INPROGRESS") return todo.status === "INPROGRESS"
    if (filter === "DONE") return todo.status === "DONE"
  })

  const handleCheck = (selected) => {
    // チェックがついたToDoのstatusを変更
    const newToDos = todos.map((todo) => {
      if (todo.key === selected.key) {
        todo.status = selected.status
      }
      return todo
    })
    setToDos(newToDos)
  }

  return (
    <div className="panel is-warning">
      <InputToDo onAdd={handleAdd} />
      <Filter onChange={handleFilterChange} value={filter} />
      {displayToDos.map((todo) => (
        <ToDo key={todo.key} todo={todo} onCheck={handleCheck} />
      ))}
      <div className="panel-block">{displayToDos.length} つのタスク</div>
    </div>
  )
}

export default ToDoApp

// import React, { useState } from "react"
// import "bulma/css/bulma.css"
// import InputToDo from "./InputToDo"
// import Filter from "./Filter"
// import ToDo from "./ToDo"

// export const ToDoApp: React.FC = () => {
//   const getKey = () => Math.random().toString(32).substring(2)

//   const [todos, setToDos] = useState<
//     { key: string; text: string; done: boolean }[]
//   >([])
//   const [filter, setFilter] = useState<"ALL" | "TODO" | "DONE">("ALL")

//   const handleAdd = (text: string) => {
//     setToDos([...todos, { key: getKey(), text, done: false }])
//   }

//   const handleFilterChange = (value: string) =>
//     setFilter(value as "ALL" | "TODO" | "DONE")

//   const displayToDos = todos.filter((todo) => {
//     if (filter === "ALL") return true
//     if (filter === "TODO") return !todo.done
//     if (filter === "DONE") return todo.done
//   })

//   const handleCheck = (checked: {
//     key: string
//     text: string
//     done: boolean
//   }) => {
//     const newToDos = todos.map((todo) => {
//       if (todo.key === checked.key) {
//         todo.done = !todo.done
//       }
//       return todo
//     })
//     setToDos(newToDos)
//   }

//   return (
//     <div className="panel is-warning">
//       <InputToDo onAdd={handleAdd} />
//       <Filter onChange={handleFilterChange} value={filter} />
//       {displayToDos.map((todo) => (
//         <ToDo key={todo.key} todo={todo} onCheck={handleCheck} />
//       ))}
//       <div className="panel-block">{displayToDos.length} つのタスク</div>
//     </div>
//   )
// }

// export default ToDoApp
