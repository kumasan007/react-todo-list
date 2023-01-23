/* App.js */
import * as React from "react"
import { Button } from "@mui/material"
import Header from "./components/Header"
import ToDoApp from "./components/ToDoApp"

const App = () => {
  return (
    <>
      <Header />
      <ToDoApp />
    </>
  )
}

export default App
