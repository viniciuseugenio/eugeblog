export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateSignupData(form) {
  const errors = {};

  if (!form.email || !isValidEmail(form.email)) {
    errors.email = ["Please provide a valid e-mail address."];
  }

  if (form.first_name === form.last_name) {
    errors.last_name = ["First name and last name must be different."];
  }

  if (form.first_name.trim().length < 3) {
    errors.first_name = ["First name must be at least 3 characters long."];
  }

  if (form.last_name.trim().length < 3) {
    errors.last_name = ["Last name must be at least 3 characters long."];
  }

  if (form.password.length < 8) {
    errors.password = ["Password must be at least 8 characters long."];
  }

  if (form.password !== form.confirm_password) {
    errors.confirm_password = ["Passwords must be identical."];
  }

  if (!form.agree) {
    errors.agree = ["You must agree with the terms and conditions."];
  }

  return errors;
}
