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
        onClick={handleClick.bind(null, "0")}
        className={classNames({ "is-active": value === "0" })}
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
        onClick={handleClick.bind(null, "1")}
        className={classNames({ "is-active": value === "1" })}
      >
        着手中
      </a>
      <a
        href="#"
        onClick={handleClick.bind(null, "2")}
        className={classNames({ "is-active": value === "2" })}
      >
        完了
      </a>
    </div>
  )
}

export default Filter
