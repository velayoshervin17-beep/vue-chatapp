import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const xsrf = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  if (xsrf) {
    const token = decodeURIComponent(xsrf.substring("XSRF-TOKEN=".length));

    config.headers["X-XSRF-TOKEN"] = token;

    console.log("CSRF HEADER SET");
  } else {
    console.log("NO XSRF-TOKEN COOKIE");
  }

  return config;
});

export default api;

//http://localhost:8080
