import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.request.use(
  async (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    await delay(500);

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
