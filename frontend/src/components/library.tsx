import "./library";
// import _ from "lodash"
import axios from "axios";

declare global {
  interface Window {
    _: typeof _;
    axios: typeof axios;
  }
}

// window._ = _
window.axios = axios;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = `http://${import.meta.env.VITE_APP_CONTAINER_DOMAINS}`;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
