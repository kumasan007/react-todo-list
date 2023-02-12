/* App.js */
import * as React from "react"
import { Button } from "@mui/material"
import Header from "./components/Header"
import ToDoApp from "./components/ToDoApp"
import Login from "./components/Login"
import Register from "./components/Register"

const App = () => {
  return (
    <>
      <Header />
      <ToDoApp />
      {/* <Login />
      <Register /> */}
    </>
  )
}

export default App
