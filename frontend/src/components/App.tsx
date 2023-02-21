import { Header } from "./Header"
import { ToDo } from "./ToDo"
import { Register } from "./Register"
import { Login } from "./Login"
import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Switch } from "react-router-dom"
import ProvideAuth, { PrivateRoute, PublicRoute, LogoutButton } from "./Auth"
import CssBaseline from "@mui/material/CssBaseline"

export const App = (): JSX.Element => {
  return (
    <>
      <CssBaseline />
      <ProvideAuth>
        <BrowserRouter>
          <Header />
          <Switch>
            <PrivateRoute path="/" exact>
              <LogoutButton />
              <ToDo />
            </PrivateRoute>
            <PublicRoute path="/register" exact>
              <Register />
            </PublicRoute>
            <PublicRoute path="/login" exact>
              <Login />
            </PublicRoute>
          </Switch>
        </BrowserRouter>
      </ProvideAuth>
    </>
  )
}

const container = document.getElementById("app")
const app = createRoot(container)
app.render(<App />)
