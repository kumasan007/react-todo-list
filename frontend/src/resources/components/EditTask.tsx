import React, { useEffect, useState } from "react"
import { Box } from "@mui/system"
import {
  Button,
  Card,
  CardContent,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ja from "date-fns/locale/ja"
import { useForm } from "react-hook-form"

type PropsType = {
  id: number
  title: string
  deadline: Date
  status: string
  created_at: Date
  modifyTask: (id: number, title: string, deadline: Date | null) => void
  closeToggle: () => void
}

export const Edit = (props: PropsType) => {
  const [editTitle, setEditTitle] = useState<string>("")
  const [editDeadline, setEditDeadline] = useState<Date | null>(new Date())
  const [currentEditError, setCurrentEditError] = useState<string | null>(null)

  useEffect(() => {
    setEditTitle(props.title)
    setEditDeadline(props.deadline)
  }, [])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value)
  }

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
    watch,
  } = useForm()
  return (
    <>
      <Dialog open={true} onClose={props.closeToggle}>
        <Card sx={{ maxWidth: 400 }}>
          <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
            タスクを編集する
          </Typography>
          <CardContent>
            <form
              onSubmit={(e) => {
                clearErrors()
                handleSubmit(() => {
                  if (!currentEditError) {
                    props.modifyTask(props.id, editTitle, editDeadline)
                  }
                })(e)
              }}
            >
              <Stack direction="column" spacing={2}>
                <Stack alignItems="right" display="flex">
                  <TextField
                    variant="outlined"
                    label="タスク"
                    defaultValue={props.title}
                    {...register("editTitle", {
                      required: "必須入力です",
                      pattern: {
                        value: /^[\S/g+]/,
                        message: "入力に誤りがあります",
                      },
                      maxLength: {
                        value: 255,
                        message: "255文字以内で入力してください",
                      },
                      onChange: handleTitleChange,
                    })}
                    helperText={
                      errors.editTitle && errors.editTitle.message?.toString()
                    }
                  />
                </Stack>
                <Stack
                  alignItems="right"
                  display="flex"
                  justify-content="flex-end"
                >
                  <LocalizationProvider
                    fullWidth
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ja}
                  >
                    <DesktopDatePicker
                      label="期限"
                      inputFormat="yyyy年MM月dd日"
                      mask="____年__月__日"
                      value={editDeadline}
                      onChange={(date) => setEditDeadline(date)}
                      onError={(reason, value) => {
                        if (reason) {
                          if (reason === "invalidDate") {
                            setCurrentEditError("入力に誤りがあります")
                          } else {
                            setCurrentEditError(reason)
                          }
                        } else {
                          setCurrentEditError(null)
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={false}
                          helperText={currentEditError ?? currentEditError}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{
                      width: "7rem",
                      height: "2rem",
                      backgroundColor: "#F96300",
                      color: "white",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: "red",
                      },
                      alignSelf: "center",
                    }}
                  >
                    変更
                  </Button>
                  <Box sx={{ width: "1rem" }} />
                  <Button
                    variant="contained"
                    onClick={() => props.closeToggle()}
                    sx={{
                      width: "7rem",
                      height: "2rem",
                      backgroundColor: "grey",
                      alignSelf: "center",
                    }}
                  >
                    キャンセル
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Dialog>
    </>
  )
}
