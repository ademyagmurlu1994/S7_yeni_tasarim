import Axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

//const URL_SERVER = "http://172.16.120.65:62000";
const URL_SERVER = String(publicRuntimeConfig.BACKEND_API_URL);

Axios.defaults.proxy = true;
Axios.defaults.prefix = URL_SERVER;
Axios.defaults.baseURL = URL_SERVER;
//Axios.defaults.browserBaseURL = URL_CLIENT;

export default Axios;

//mit and proxy
