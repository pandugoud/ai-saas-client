import api from "./axios";

export const searchWebApi = async (query) => {
  const { data } = await api.post("/search/web", { query });
  return data;
};