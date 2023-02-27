import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react"
import { Route, Redirect, useHistory } from "react-router-dom"
import { LoadingButton } from "@mui/lab"
import { CircularProgress } from "@mui/material"
import { useForm } from "react-hook-form"
import axios from "axios"

interface LoginData {
  email: string
  password: string
  submit: any
}

interface RegisterData {
  email: string
  password: string
  password_confirmation: string
}

interface authProps {
  isLogin: boolean
  isLoading: boolean
  resetIsLogin: () => void
  register: (registerData: RegisterData) => Promise<void>
  login: (loginData: LoginData) => Promise<void>
  logout: () => Promise<void>
}

interface Props {
  children: ReactNode
}

interface RouteProps {
  children: ReactNode
  path: string
  exact?: boolean
}

interface From {
  from: Location
}

const authContext = createContext<authProps | null>(null)

const ProvideAuth = ({ children }: Props) => {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}
export default ProvideAuth

export const useAuth = () => {
  return useContext(authContext)
}

const useProvideAuth = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { setError } = useForm<LoginData>()
  const resetIsLogin = () => setIsLogin(false)

  const login = async (loginData: LoginData) => {
    try {
      await axios.post("/api/login", loginData).then((res) => {
        setIsLogin(true)
        setIsLoading(false)
      })
    } catch (error) {
      throw error
    }
  }

  const register = (registerData: RegisterData) => {
    return axios
      .post("/api/register", registerData)
      .then((res) => {
        login({
          email: registerData.email,
          password: registerData.password,
        } as LoginData)
      })
      .catch((error) => {
        throw error
      })
  }

  const logout = async () => {
    try {
      await axios.delete("/api/logout")
      setIsLogin(false)
      setIsLoading(false)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        const res = await axios.get("/api/tasks").then((res) => res.status)
        setIsLogin(res === 200 ? true : false)
      } catch (error) {
        setIsLogin(false)
      }
      setIsLoading(false)
    })()
  }, [])

  return { isLogin, isLoading, resetIsLogin, register, login, logout }
}

export const PrivateRoute = ({ children, path, exact = false }: RouteProps) => {
  const auth = useAuth()

  return (
    <>
      {auth?.isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Route
          path={path}
          exact={exact}
          render={({ location }) => {
            if (auth?.isLogin) {
              return children
            } else {
              return (
                <Redirect
                  to={{ pathname: "/login", state: { from: location } }}
                />
              )
            }
          }}
        />
      )}
    </>
  )
}

export const PublicRoute = ({ children, path, exact = false }: RouteProps) => {
  const auth = useAuth()
  const history = useHistory()

  return (
    <>
      {auth?.isLoading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <Route
          path={path}
          exact={exact}
          render={({ location }) => {
            if (auth?.isLogin) {
              return (
                <Redirect
                  to={{
                    pathname: (history.location.state as From)
                      ? (history.location.state as From).from.pathname
                      : "/",
                    state: { from: location },
                  }}
                />
              )
            } else {
              return children
            }
          }}
        />
      )}
    </>
  )
}

export const LogoutButton = () => {
  const auth = useAuth()
  const [loading, setLoading] = useState<boolean>(false)

  const logout = () => {
    setLoading(true)
    auth?.logout()
    setLoading(false)
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        marginTop: "1rem",
      }}
    >
      <LoadingButton
        loading={loading}
        onClick={logout}
        type="submit"
        variant="contained"
        sx={{
          width: "fit-content",
          borderRadius: 24,
          backgroundColor: "#F96300",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "red",
          },
        }}
      >
        ログアウト
      </LoadingButton>
    </div>
  )
}
