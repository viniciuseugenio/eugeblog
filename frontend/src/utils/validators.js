import { ERROR_MESSAGES } from "./constants";

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSignupData(form) {
  const errors = {};

  if (!form.email || !isValidEmail(form.email)) {
    errors.email = [ERROR_MESSAGES.INVALID_EMAIL];
  }

  if (form.first_name === form.last_name) {
    errors.last_name = [ERROR_MESSAGES.EQUAL_NAMES];
  }

  if (form.first_name.trim().length < 3) {
    errors.first_name = [ERROR_MESSAGES.FIRST_NAME_LENGTH];
  }

  if (form.last_name.trim().length < 3) {
    errors.last_name = [ERROR_MESSAGES.LAST_NAME_LENGTH];
  }

  if (form.password.length < 9) {
    errors.password = [ERROR_MESSAGES.PASSWORD_LENGTH];
  }

  if (form.password !== form.confirm_password) {
    errors.confirm_password = [ERROR_MESSAGES.CONFIRM_PASSWORD];
  }

  if (!form.agree) {
    errors.agree = [ERROR_MESSAGES.AGREE_TERMS];
  }

  return errors;
}

