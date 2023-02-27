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
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type PropsType = {
  id: number
  title: string
  deadline: Date
  status: number
  created_at: Date
  modifyTask: (id: number, title: string, deadline: Date | null) => void
  closeToggle: () => void
}

export const Edit = (props: PropsType) => {
  const [editTitle, setEditTitle] = useState<string>("")
  const [editDeadline, setEditDeadline] = useState<Date | null>(new Date())
  const [currentEditError, setCurrentEditError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
    watch,
  } = useForm()

  useEffect(() => {
    setEditTitle(props.title)
    setEditDeadline(props.deadline)
  }, [props.title, props.deadline])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value)
  }

  return (
    <Dialog open={true} onClose={props.closeToggle}>
      <Box
        component="form"
        onSubmit={handleSubmit(() =>
          props.modifyTask(props.id, editTitle, editDeadline)
        )}
        sx={{ px: 4, py: 3 }}
      >
        <Typography variant="h6">タスクを編集する</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="タイトル"
            value={editTitle}
            onChange={handleTitleChange}
            inputProps={register("title", { required: true, maxLength: 20 })}
            error={errors.title != null}
            helperText={
              errors.title?.type === "required"
                ? "必須項目です"
                : errors.title?.type === "maxLength"
                ? "20文字以下で入力してください"
                : ""
            }
            onFocus={clearErrors}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ja}>
            <DesktopDatePicker
              label="期限"
              value={editDeadline}
              onChange={(newDate) => setEditDeadline(newDate)}
              inputFormat="yyyy/MM/dd"
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputProps={register("deadline")}
                  onFocus={clearErrors}
                />
              )}
            />
          </LocalizationProvider>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="contained" onClick={props.closeToggle}>
              キャンセル
            </Button>
            <Button variant="contained" type="submit">
              保存
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  )
}
