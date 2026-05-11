import axios from "axios";

const api = axios.create({
  baseURL: typeof window === "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
    : "/api/proxy",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect if skipAuthRedirect flag is set (e.g., for landing page)
    const skipAuthRedirect = (error.config as any)?.skipAuthRedirect;
    
    if (
      error.response?.status === 401 &&
      !skipAuthRedirect &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
