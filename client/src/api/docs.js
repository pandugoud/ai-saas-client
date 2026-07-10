import api from "./axios";

export const trainDocumentApi = async (file, botId = "default-bot", userId = "") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("botId", botId);
  formData.append("userId", userId);

  const { data } = await api.post("/ai/train", formData);
  return data;
};