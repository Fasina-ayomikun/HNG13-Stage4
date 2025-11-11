export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const validatePassword = (pwd: string) => pwd.length >= 6;

export const validateConfirm = (pwd: string, confirm: string) =>
  pwd === confirm && confirm.length > 0;
