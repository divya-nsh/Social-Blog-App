import axios from "axios";
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "/";

const makeRq = axios.create({
  baseURL: `${API_BASE_URL}/`,
  headers: {
    ...(localStorage.getItem("authToken")
      ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      : {}),
  },
});

makeRq.interceptors.response.use(
  (res) => {
    if (res.data?.authToken) {
      localStorage.setItem("authToken", res.data.authToken);
      makeRq.defaults.headers.common["Authorization"] =
        `Bearer ${res.data.authToken}`;
    }
    return res;
  },
  (error) => {
    if (error instanceof axios.AxiosError) {
      if (error.response) {
        error.message = error.response.data?.message || error.message;
      } else if (error.request) {
        error.message = "Unable to make request";
      }
    }
    return Promise.reject(error);
  },
);

export default makeRq;
