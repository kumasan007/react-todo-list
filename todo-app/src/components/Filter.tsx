import classNames from "classnames"
import "bulma/css/bulma.css"

export const Filter = (props) => {
  // propsを定義
  const { value, onChange } = props

  // フィルターの切り替え
  const handleClick = (key, event) => {
    event.preventDefault()
    onChange(key)
  }

  return (
    <div className="panel-tabs">
      {/* <a
        href="#"
        onClick={handleClick.bind(null, "ALL")}
        className={classNames({ "is-active": value === "ALL" })}
      >
        全て
      </a> */}
      <a
        href="#"
        onClick={handleClick.bind(null, "NOTSTARTED")}
        className={classNames({ "is-active": value === "NOTSTARTED" })}
      >
        未着手
      </a>
      <a
        href="#"
        onClick={handleClick.bind(null, "DEADLINE")}
        className={classNames({ "is-active": value === "DEADLINE" })}
      >
        期日あり
      </a>
      <a
        href="#"
        onClick={handleClick.bind(null, "INPROGRESS")}
        className={classNames({ "is-active": value === "INPROGRESS" })}
      >
        着手中
      </a>
      <a
        href="#"
        onClick={handleClick.bind(null, "DONE")}
        className={classNames({ "is-active": value === "DONE" })}
      >
        完了
      </a>
    </div>
  )
}

export default Filter
