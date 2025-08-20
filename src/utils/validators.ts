export const isEmailValid = (email: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
export const isPasswordStrong = (password: string) => password.length >= 6;
