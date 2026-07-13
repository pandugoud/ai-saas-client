import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-saas-client.onrender.com",
  withCredentials: true,
});

export default api;
