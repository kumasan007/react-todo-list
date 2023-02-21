import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useForm } from "react-hook-form"
import TextField from "@mui/material/TextField"
import { LoadingButton } from "@mui/lab"
import { useHistory } from "react-router"
import ReactDOM from "react-dom"
import { useAuth } from "./Auth"
import { Grid, Paper, Stack, Typography } from "@mui/material"

interface LoginData {
  email: string
  password: string
  submit: any
}

export const Login = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<LoginData>()
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const history = useHistory()

  const onSubmit = (data: LoginData) => {
    setLoading(true)
    axios.get("/sanctum/csrf-cookie").then(() => {
      auth
        ?.login(data)
        .then(() => {
          history.push("")
        })
        .catch((error) => {
          setError("submit", {
            type: "manual",
            message:
              "ログインに失敗しました。メールアドレス、パスワードを確認してください。",
          })
          setLoading(false)
        })
    })
  }

  return (
    <>
      <Grid container>
        <Paper sx={{ p: 4, height: "420px", width: "380px", m: "40px auto" }}>
          <Stack alignItems="center" spacing={1}>
            <h2>
              <Typography variant="caption" display="block" fontSize="1.6rem">
                ログイン
              </Typography>
            </h2>
            <form
              onSubmit={(e) => {
                clearErrors()
                handleSubmit(onSubmit)(e)
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="メールアドレス"
                {...register("email", { required: "入力必須です" })}
              />
              {errors.email && <span>{errors.email.message}</span>}
              <TextField
                fullWidth
                id="password"
                type="password"
                variant="outlined"
                label="パスワード"
                sx={{ mt: "1rem" }}
                {...register("password", { required: "入力必須です" })}
              />
              {errors.password && <span>{errors.password.message}</span>}
              <LoadingButton
                loading={loading}
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: "1rem", mb: "1rem" }}
              >
                ログイン
              </LoadingButton>
              {errors.submit && (
                <span className="block text-red-400">
                  {errors.submit.message}
                </span>
              )}
            </form>

            <Typography>
              <Link to="/register">新規登録</Link>
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </>
  )
}

if (document.getElementById("login")) {
  ReactDOM.render(<Login />, document.getElementById("login"))
}
