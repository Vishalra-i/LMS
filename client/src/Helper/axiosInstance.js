import axios from 'axios';

const baseURL = `${process.env.REACT_APP_SERVER_URL}/api/v1`

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true // For handling cookies (if needed)
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Replace with your token storage logic
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosInstance;


