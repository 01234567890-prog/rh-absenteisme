import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const isAuthEndpoint =
    config.url && config.url.indexOf("/auth/") !== -1;

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = "Bearer " + token;
  }

  return config;
});

export default api;