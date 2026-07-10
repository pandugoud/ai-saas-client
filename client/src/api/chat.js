// import api from "./axios";

// export const generalChatApi = async (payload) => {
//   const response = await api.post("/chat", payload);
//   return response.data;
// };

import api from "./axios";

// send message
export const generalChatApi = async (payload) => {
  const response = await api.post("/chat", payload);
  return response.data;
};

// get all sessions
export const getSessionsApi = async () => {
  const response = await api.get("/chat/sessions");
  return response.data;
};

// get single session
export const getSessionByIdApi = async (id) => {
  const response = await api.get(`/chat/sessions/${id}`);
  return response.data;
};
