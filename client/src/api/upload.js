import api from "./axios";

export const uploadDocApi = async (file, botId = "default-bot") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("botId", botId);

  const { data } = await api.post("/ai/train", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};