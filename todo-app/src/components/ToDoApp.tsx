import React, { useState } from "react"
import "bulma/css/bulma.css"
import InputToDo from "./InputToDo"
import Filter from "./Filter"
import ToDo from "./ToDo"
import { Button } from "@mui/material"
import "./ToDoApp.css"
import axios from "axios"
// import { InputToDo, Filter, ToDo } from "./index"

type ToDo = {
  key: string
  createdAt: Date
  text: string
  deadline: Date | undefined
  status: "NOTSTARTED" | "INPROGRESS" | "DONE"
  deadlineStatus: boolean
}

export const ToDoApp: React.FC = () => {
  const getKey = () => Math.random().toString(32).substring(2)

  // stateを作成
  const [todos, setToDos] = useState<ToDo[]>([])
  const [filter, setFilter] = useState<
    "ALL" | "NOTSTARTED" | "INPROGRESS" | "DONE" | "DEADLINE"
  >("ALL")

  // 入力値をtodos(配列)に設定
  const handleAdd = (text: string, deadline: Date | undefined) => {
    setToDos([
      ...todos,
      {
        key: getKey(),
        createdAt: new Date(),
        text,
        deadline,
        status: "NOTSTARTED",
        deadlineStatus: Boolean(deadline),
      },
    ])
  }

  // フィルターの切り替え
  const handleFilterChange = (
    value: "ALL" | "NOTSTARTED" | "INPROGRESS" | "DONE" | "DEADLINE"
  ) => setFilter(value)

  // フィルターに応じたToDoを表示
  const displayToDos = todos.filter((todo) => {
    if (filter === "NOTSTARTED") return todo.status === "NOTSTARTED"
    if (filter === "DEADLINE") return todo.deadlineStatus === true
    if (filter === "INPROGRESS") return todo.status === "INPROGRESS"
    if (filter === "DONE") return todo.status === "DONE"
    return true
  })

  const handleCheck = (selected: ToDo) => {
    // チェックがついたToDoのstatusを変更
    const newToDos = todos.map((todo) => {
      if (todo.key === selected.key) {
        todo.status = selected.status
      }
      return todo
    })
    setToDos(newToDos)
  }

  // 期日に応じたソート機能
  const sortByDeadline = (sortOrder) => {
    let sortedToDos = [...todos]
    sortedToDos.sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.deadline) - new Date(b.deadline)
      } else {
        return new Date(b.deadline) - new Date(a.deadline)
      }
    })
    setToDos(sortedToDos)
  }

  // 作成日に応じたソート機能
  const sortByDate = (sortOrder) => {
    let sortedToDos = [...todos]
    sortedToDos.sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt) - new Date(b.createdAt)
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    setToDos(sortedToDos)
  }

  return (
    <div className="panel is-warning">
      <InputToDo onAdd={handleAdd} />
      <Filter onChange={handleFilterChange} value={filter} />
      <div className="buttons">
        <Button
          variant="contained"
          onClick={() => sortByDate("asc")}
          className="button"
        >
          作成日(↑)
        </Button>
        <Button
          variant="outlined"
          onClick={() => sortByDate("desc")}
          className="button"
        >
          作成日(↓)
        </Button>
        <Button
          variant="contained"
          onClick={() => sortByDeadline("asc")}
          className="button"
        >
          期日(↑)
        </Button>
        <Button
          variant="outlined"
          onClick={() => sortByDeadline("desc")}
          className="button"
        >
          期日(↓)
        </Button>
      </div>
      {displayToDos.map((todo) => (
        <ToDo key={todo.key} todo={todo} onCheck={handleCheck} />
      ))}
      {displayToDos.length === 0 ? (
        <div className="panel-block">タスクがありません</div>
      ) : (
        <div className="panel-block">{displayToDos.length} つのタスク</div>
      )}
    </div>
  )
}

export default ToDoApp
