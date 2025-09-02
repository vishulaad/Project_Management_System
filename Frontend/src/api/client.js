// Simple axios client with JWT header support
import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  timeout: 20000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adjust if you store elsewhere
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
