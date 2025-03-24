import { ERROR_MESSAGES } from "./constants";

const { VITE_BASE_BACKEND_URL } = import.meta.env;

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

export async function validateEmail(email, setClientSide) {
  if (!isValidEmail(email)) {
    setClientSide((prev) => ({
      errors: {
        ...prev.errors,
        email: [ERROR_MESSAGES.INVALID_EMAIL],
      },
    }));
    return;
  }

  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/accounts/validate-email/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      },
    );
    const data = await response.json();

    if (data.exists) {
      setClientSide((prev) => ({
        errors: {
          ...prev.errors,
          email: [ERROR_MESSAGES.EMAIL_IN_USE],
        },
      }));
    } else {
      setClientSide((prev) => {
        const newErrors = { ...prev.errors };
        delete newErrors.email;
        return { errors: newErrors };
      });
    }
  } catch (err) {
    console.log("Email validation failed:", err);
  }
}

export function validateConfirmPassword(form, value, setClientSide) {
  const password = form.elements.password.value;
  const confirm_password = value;

  if (password !== confirm_password) {
    setClientSide((prev) => ({
      errors: {
        ...prev.errors,
        confirm_password: [ERROR_MESSAGES.CONFIRM_PASSWORD],
      },
    }));
  }
}

export function validateLastName(form, value, setClientSide) {
  const firstName = form.elements.first_name.value;
  const lastName = value;

  if (firstName === lastName) {
    setClientSide((prev) => ({
      errors: {
        ...prev.errors,
        last_name: [ERROR_MESSAGES.EQUAL_NAMES],
      },
    }));
  }
}
