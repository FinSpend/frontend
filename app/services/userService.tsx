import api from "./api";

export const register = (data:any) => {
  return api.post("/auth/register", data);
};
export const login = (data:any) => {
  return api.post("/auth/login", data);
};
// export const getUsers = () => api.get("/auth/register");
export const getProfile = () => api.get("/auth/me");

export const logout = () => {
  return api.post("/auth/logout");
};