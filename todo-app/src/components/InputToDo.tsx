import React, { useState } from "react"
import "bulma/css/bulma.css"
import { Dayjs } from "dayjs"
import TextField from "@mui/material/TextField"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Button, Stack } from "@mui/material"
import "./InputToDo.css"

export const InputToDo = (props) => {
  // stateを作成
  const [text, setText] = useState("")
  const [deadline, setDeadline] = React.useState<Dayjs | null>(null)

  //入力値をtextに反映
  const handleChange = (e) => setText(e.target.value)

  // Enter押下時、ToDoに追加
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      // 入力値が空白文字の場合終了
      if (!text.match(/\S/g)) return
      // ToDoAppクラスの「handleAdd」関数を実行
      props.onAdd(text, deadline)
      setText("")
      setDeadline(null)
    }
  }

  return (
    <div>
      <div className="panel-block">
        <input
          className="input"
          type="text"
          placeholder="Enterで確定"
          value={text}
          onChange={handleChange}
          onKeyPress={handleEnter}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="年/月/日"
            value={deadline}
            onChange={(newDeadline) => {
              setDeadline(newDeadline.format("YYYY-MM-DD"))
            }}
            renderInput={(params) => (
              <TextField {...params} onKeyPress={handleEnter} />
            )}
          />
        </LocalizationProvider>
      </div>
    </div>
  )
}

export default InputToDo
