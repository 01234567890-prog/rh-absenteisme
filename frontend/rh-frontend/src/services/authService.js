import api from "./api";

export async function login(email, password) {
  const response = await api.post("/auth/login", { email, password });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("email", response.data.email);
  localStorage.setItem("role", response.data.role);

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}

export function getCurrentRole() {
  return localStorage.getItem("role");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}