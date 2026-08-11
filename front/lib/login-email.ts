const LOGIN_EMAIL_KEY = "loginEmail";

export function saveLoginEmail(email: string) {
  localStorage.setItem(LOGIN_EMAIL_KEY, email);
}

export function getLoginEmail() {
  return localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
}

export function clearLoginEmail() {
  localStorage.removeItem(LOGIN_EMAIL_KEY);
}
