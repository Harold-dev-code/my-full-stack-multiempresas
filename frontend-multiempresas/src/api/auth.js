const API_URL = "http://localhost:8000/api";

export async function login(username, password) {
  const response = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export function setTokens(access, refresh) {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
}

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  return localStorage.getItem("refresh");
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}