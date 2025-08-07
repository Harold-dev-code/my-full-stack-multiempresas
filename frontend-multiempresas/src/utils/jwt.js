// Utilidades para manejar el token JWT en localStorage

export const setToken = (access, refresh) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
};

export const getAccessToken = () => localStorage.getItem('access');
export const getRefreshToken = () => localStorage.getItem('refresh');
export const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

export default function jwt_decode(token) {
  if (!token) return {};
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}
