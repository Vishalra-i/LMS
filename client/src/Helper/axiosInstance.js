import axios from "axios";

console.log(process.env.REACT_APP_SERVER_URL)
const BASE_URL = `${process.env.REACT_APP_SERVER_URL}/api/v1`;

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
