import axios from "axios";
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/";
const makeRq = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

makeRq.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      error.message = error.response.data.error || error.message;
      error.statusCode = error.response.status;
    } else if (error.request) {
      error.message = "Unable to make request";
    }
    throw error;
  },
);

export default makeRq;
