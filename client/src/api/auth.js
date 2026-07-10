import api from "./axios";

export const registerApi = async (name, email, password) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const loginApi = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const meApi = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

// import api from "./axios";

// export const registerApi = async (payload) => {
//   const response = await api.post("/auth/register", payload);
//   return response.data;
// };

// export const loginApi = async (payload) => {
//   const response = await api.post("/auth/login", payload);
//   return response.data;
// };

// export const getMeApi = async () => {
//   const response = await api.get("/auth/me");
//   return response.data;
// };
