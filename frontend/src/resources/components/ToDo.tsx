import React, { useEffect, useState, useRef } from "react"
import ReactDOM from "react-dom"
import axios from "axios"
import { Box } from "@mui/system"
import {
  Alert,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid,
  IconButton,
  NativeSelect,
  Stack,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material"
import { useAuth } from "./Auth"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import ja from "date-fns/locale/ja"
import { useForm } from "react-hook-form"
import CloseIcon from "@mui/icons-material/Close"
import { Edit } from "./EditTask"

type Task = {
  id: number
  title: string
  deadline: Date
  status: string
  created_at: Date
}
type newTaskData = {
  title?: string
  deadline?: string
}

const statusArray = [
  { key: "todo", label: "未着手" },
  { key: "doing", label: "着手中" },
  { key: "done", label: "完了" },
]

type Filter = "ALL" | "未着手" | "期限あり" | "着手中" | "完了"
type Sort =
  | "期限（降順）"
  | "期限（昇順）"
  | "作成日（降順）"
  | "作成日（昇順）"

const zeroPadding = (data: string) => {
  if (data.length == 1) {
    return "0" + data
  } else {
    return data
  }
}

const formatDate = (date: Date | null): string | null => {
  if (date === null) {
    return null
  } else {
    const inputDate = new Date(date)
    const YYYY = inputDate.getFullYear().toString()
    const MM = zeroPadding((inputDate.getMonth() + 1).toString())
    const DD = zeroPadding(inputDate.getDate().toString())
    return `${YYYY}-${MM}-${DD}`
  }
}

export const ToDo = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState<string>("")
  const [deadline, setDeadline] = useState<Date | null>(new Date())
  const [isLoading, setLoading] = useState<boolean>(false)
  const auth = useAuth()
  const [sortMethod, setSortMethod] = useState<Sort>("期限（降順）")
  const [filter, setFilter] = useState<Filter>("ALL")
  const [toggle, setToggle] = useState(false)
  const [toggleId, setToggleId] = useState<number | null>(null)
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [currentErrorMessage, setcurrentErrorMessage] = useState<string | null>(
    null
  )

  useEffect(() => {
    axios
      .get(`/api/tasks`)
      .then((response) => {
        setTasks(response.data)
      })
      .catch((error) => {
        const errorCode = Number(error.response.status)
        if (errorCode === 401 || errorCode === 419) {
          auth?.resetIsLogin()
        }
      })
    setLoading(false)
  }, [isLoading])

  const handleTitleCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleStatusChange = (newStatus: string, id: number) => {
    axios
      .put(`/api/tasks/${id}`, { status: newStatus })
      .then((response) => {
        let updateTasks = tasks.map((task) => {
          if (task.id === response.data.task.id) {
            return response.data.task as Task
          } else {
            return task
          }
        })
        setTasks([...updateTasks])
      })
      .catch((error) => {
        const errorCode = Number(error.response.status)
        if (errorCode === 401 || errorCode === 419) {
          auth?.resetIsLogin()
        }
      })
    setLoading(true)
  }

  const createTask = (): void => {
    axios
      .post(`/api/tasks`, {
        title: title,
        deadline: formatDate(deadline),
        status: "todo",
      })
      .then((response) => {
        const newTask = response.data.task as Task
        setTasks([...tasks, newTask])
      })
      .then(() => {
        handleTitleCreate
        setDeadline(deadline)
        reset()
      })
      .catch((error) => {
        const errorCode = Number(error.response.status)
        if (errorCode === 401 || errorCode === 419) {
          auth?.resetIsLogin()
        }
      })
    setOpenCreate(true)
    setLoading(true)
  }

  const deleteTask = (id: number) => {
    axios
      .delete(`/api/tasks/${id}`)
      .then((response) => {
        setTasks(tasks.filter((task) => task.id !== id))
      })
      .catch((error) => {
        const errorCode = Number(error.response.status)
        if (errorCode === 401 || errorCode === 419) {
          auth?.resetIsLogin()
        }
      })
    setOpenDelete(true)
    setLoading(true)
  }

  const formModifyTask = (id: number, title: string, deadline: Date | null) => {
    const postData = {
      deadline: formatDate(deadline),
      title: title,
    } as newTaskData

    axios
      .put(`/api/tasks/${id}`, postData)
      .then((response) => {
        let updateTasks = tasks.map((task) => {
          if (task.id === response.data.task.id) {
            return response.data.task as Task
          } else {
            return task
          }
        })
        setTasks([...updateTasks])
        setToggle(false)
        setToggleId(null)
      })
      .catch((error) => {
        const errorCode = Number(error.response.status)
        if (errorCode === 401 || errorCode === 419) {
          auth?.resetIsLogin()
        }
      })
    setOpenEdit(true)
    setLoading(true)
  }

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "ALL":
        return task
      case "未着手":
        return task.status === "todo"
      case "期限あり":
        return task.deadline !== null
      case "着手中":
        return task.status === "doing"
      case "完了":
        return task.status === "done"
      default:
        return task
    }
  })

  const sortByDate = filteredTasks.sort((a: Task, b: Task) => {
    switch (sortMethod) {
      case "期限（降順）":
        if (a.deadline === null && b.deadline === null) {
          return 0
        } else if (a.deadline === null) {
          return 1
        } else if (b.deadline === null) {
          return -1
        }
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
      case "期限（昇順）":
        if (a.deadline === null && b.deadline === null) {
          return 0
        } else if (a.deadline === null) {
          return 1
        } else if (b.deadline === null) {
          return -1
        }
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      case "作成日（降順）":
        return b.id - a.id
      case "作成日（昇順）":
        return a.id - b.id
      default:
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
  })

  const toggleInput = (task: Task) => {
    reset()
    setToggleId(task.id)
    setToggle(true)
  }

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
    reset,
  } = useForm()
  return (
    <Grid
      container
      justify-items="center"
      alignItems="center"
      sx={{ padding: "36px" }}
    >
      <Grid item xs={32}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={(e) => {
              clearErrors()
              handleSubmit(() => {
                if (!currentErrorMessage) {
                  createTask()
                }
              })(e)
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: "1rem" }}>
              <TextField
                variant="outlined"
                label="タスク"
                {...register("title", {
                  required: "必須入力です",
                  pattern: {
                    value: /^[\S/g+]/,
                    message: "入力に誤りがあります",
                  },
                  maxLength: {
                    value: 255,
                    message: "255文字以内で入力してください",
                  },
                  onChange: handleTitleCreate,
                })}
                helperText={errors.title && errors.title.message?.toString()}
                sx={{ width: "280px" }}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mb: "1rem" }}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ja}
              >
                <DesktopDatePicker
                  label="期限"
                  inputFormat="yyyy年MM月dd日"
                  mask="____年__月__日"
                  value={deadline}
                  onChange={(date) => setDeadline(date)}
                  onError={(reason, value) => {
                    if (reason) {
                      if (reason === "invalidDate") {
                        setcurrentErrorMessage("入力に誤りがあります")
                      } else {
                        setcurrentErrorMessage(reason)
                      }
                    } else {
                      setcurrentErrorMessage(null)
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: "280px" }}
                      {...params}
                      error={false}
                      helperText={currentErrorMessage ?? currentErrorMessage}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                sx={{ height: "50px" }}
                type="submit"
                variant="contained"
                sx={{ width: "150px" }}
                onClick={() => createTask()}
              >
                作成
              </Button>
            </Box>
          </form>
        </Box>

        <Stack
          sx={{ width: "100%", height: "50px" }}
          style={{ flexGrow: 1 }}
          direction="row"
          spacing={3}
          justifyContent="center"
        >
          <NativeSelect
            sx={{ borderBottom: "none" }}
            defaultValue="New"
            onChange={(e) => setSortMethod(e.target.value as Sort)}
          >
            <option value="期限（降順）">期限（↓）</option>
            <option value="期限（昇順）">期限（↑）</option>
            <option value="作成日（降順）">作成日（↓）</option>
            <option value="作成日（昇順）">作成日（↑）</option>
          </NativeSelect>
          <NativeSelect
            sx={{ borderBottom: "none" }}
            defaultValue="ALL"
            onChange={(e) => setFilter(e.target.value as Filter)}
          >
            <option value="すべて">すべて</option>
            <option value="未着手">未着手</option>
            <option value="期限あり">期限あり</option>
            <option value="着手中">着手中</option>
            <option value="完了">完了</option>
          </NativeSelect>
        </Stack>

        <Card sx={{ width: "100%", maxHeight: "5em" }}>
          <CardContent
            sx={{ padding: "32px", maxHeight: "5em" }}
            style={{ backgroundColor: "#1976d2" }}
          >
            <Stack alignItems="center">
              <Stack width="100%" direction="row" alignItems="center">
                <Typography sx={{ width: "40%" }}>
                  タスク（クリックで編集）
                </Typography>
                <Typography sx={{ width: "20%" }}>期限</Typography>
                <Typography sx={{ width: "20%" }}>状態</Typography>
                <Typography>作成日</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        {sortByDate.map((task: Task, index: number) => (
          <Card key={index} sx={{ width: "100%" }}>
            <CardContent sx={{ padding: "10px" }}>
              <Stack alignItems="center">
                <Stack width="100%" direction="row" alignItems="center">
                  {toggle && task.id === toggleId ? (
                    <Stack direction="row" sx={{ width: "100%" }}>
                      <Edit
                        {...task}
                        modifyTask={(
                          id: number,
                          title: string,
                          deadline: Date | null
                        ) => formModifyTask(id, title, deadline)}
                        closeToggle={() => setToggle(false)}
                      />
                    </Stack>
                  ) : (
                    <>
                      <Typography
                        sx={{ width: "40%" }}
                        onClick={() => toggleInput(task)}
                      >
                        {task.title}
                      </Typography>
                      <Typography
                        sx={{ width: "20%" }}
                        onClick={() => toggleInput(task)}
                      >
                        {formatDate(task.deadline) || "期限なし"}
                      </Typography>
                    </>
                  )}
                  <Stack sx={{ width: "19%" }}>
                    {
                      <div className="container">
                        <section style={{ flexGrow: 1 }}>
                          <NativeSelect
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(
                                e.target.value as Filter,
                                task.id
                              )
                            }
                          >
                            {statusArray.map((item) => (
                              <option key={item.key} value={item.key}>
                                {item.label}
                              </option>
                            ))}
                          </NativeSelect>
                        </section>
                      </div>
                    }
                  </Stack>
                  <Typography sx={{ width: "15%" }}>
                    {formatDate(task.created_at)}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      onClick={() => deleteTask(task.id)}
                      sx={{
                        backgroundColor: "grey",
                        color: "white",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "red",
                        },
                      }}
                    >
                      削除
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  )
}

if (document.getElementById("ToDo")) {
  ReactDOM.render(<ToDo />, document.getElementById("crud"))
}
