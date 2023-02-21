import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useForm } from "react-hook-form"
import TextField from "@mui/material/TextField"
import { LoadingButton } from "@mui/lab"
import { useHistory } from "react-router-dom"
import ReactDOM from "react-dom"
import { useAuth } from "./Auth"
import { Grid, Paper, Stack, Typography } from "@mui/material"

interface EmailAndPasswordData {
  name: string
  email: string
  password: string
  password_confirmation: string
  submit: any
}

export const Register = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<EmailAndPasswordData>()
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const history = useHistory()

  const onSubmit = (data: EmailAndPasswordData) => {
    setLoading(true)
    axios.get("/sanctum/csrf-cookie").then(() => {
      auth
        ?.register(data)
        .then(() => {
          history.push("")
        })
        .catch((error) => {
          setError("submit", {
            type: "manual",
            message: "このアドレスは使用済みです。",
          })
          setLoading(false)
        })
    })
  }

  return (
    <>
      <Grid container>
        <Paper sx={{ p: 4, height: "540px", width: "380px", m: "40px auto" }}>
          <Stack alignItems="center" spacing={1}>
            <h2>
              <Typography variant="caption" display="block" fontSize="1.4rem">
                新規登録
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
                label="名前"
                {...register("name", {
                  required: "入力必須です",
                  pattern: {
                    value: /^[\S/g+]/,
                    message: "入力に誤りがあります",
                  },
                  maxLength: {
                    value: 255,
                    message: "255文字以内で入力してください",
                  },
                })}
              />
              {errors.name && (
                <span className="block text-red-400">
                  {errors.name.message}
                </span>
              )}
              <TextField
                fullWidth
                variant="outlined"
                label="メールアドレス"
                sx={{ mt: "1rem" }}
                {...register("email", {
                  required: "入力必須です",
                  pattern: {
                    value: /^[\w\-._]+@[\w\-._]+/,
                    message: "入力に誤りがあります",
                  },
                  maxLength: {
                    value: 255,
                    message: "255文字以内で入力してください",
                  },
                })}
              />
              {errors.email && (
                <span className="block text-red-400">
                  {errors.email.message}
                </span>
              )}
              <TextField
                fullWidth
                id="password"
                type="password"
                variant="outlined"
                sx={{ mt: "1rem" }}
                label="パスワード(8文字以上)"
                {...register("password", {
                  required: "入力必須です",
                  pattern: {
                    value: /^[\S/g+]/,
                    message: "入力に誤りがあります",
                  },
                  minLength: {
                    value: 8,
                    message: "8文字以上で入力してください",
                  },
                })}
              />
              {errors.password && (
                <span className="block text-red-400">
                  {errors.password.message}
                </span>
              )}
              <TextField
                fullWidth
                type="password"
                variant="outlined"
                label="パスワード確認"
                {...register("password_confirmation", {
                  required: "入力してください",
                  pattern: {
                    value: /^[\S/g+]/,
                    message: "入力に誤りがあります",
                  },
                  validate: {
                    match: (value) =>
                      value ===
                        (
                          document.getElementById(
                            "password"
                          ) as HTMLInputElement
                        ).value || "パスワードが一致しません",
                  },
                })}
              />
              {errors.password_confirmation && (
                <span className="block text-red-400">
                  {errors.password_confirmation.message}
                </span>
              )}
              <LoadingButton
                type="submit"
                loading={loading}
                variant="contained"
                fullWidth
                sx={{ mt: "1rem", mb: "1rem" }}
              >
                登録
              </LoadingButton>
              {errors.submit && (
                <span className="block text-red-400">
                  {errors.submit.message}
                </span>
              )}
            </form>

            <Typography>
              <Link to="/login">ログイン</Link>
            </Typography>
          </Stack>
        </Paper>
      </Grid>
    </>
  )
}

if (document.getElementById("register")) {
  ReactDOM.render(<Register />, document.getElementById("register"))
}
