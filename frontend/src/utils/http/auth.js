const { VITE_BASE_BACKEND_URL } = import.meta.env;

const UNEXPECTED_ERROR = "An unexpected error occurred. Please, try again.";

async function refreshToken() {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/token/refresh/`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    return response.ok;
  } catch (error) {
    console.error("Error refreshing token", error);
    return false;
  }
}

async function verifyToken() {
  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/token/verify/`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying token:", error);
    throw error;
  }
}

export async function isUserAuthenticated() {
  try {
    let data = await verifyToken();

    if (data) {
      return { isAuthenticated: true, userId: data.user_id };
    }

    const refreshed = await refreshToken();

    if (refreshed) {
      data = await verifyToken();
      if (data) {
        return { isAuthenticated: true, userId: data.user_id };
      }
    }

    return { isAuthenticated: false, userId: null };
  } catch (error) {
    console.error("Error checking authentication:", error);
    return { isAuthenticated: false, userId: null };
  }
}

export async function loginUser(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const remember = formData.get("remember");

  try {
    const response = await fetch(`${VITE_BASE_BACKEND_URL}/api/token/`, {
      method: "POST",
      body: JSON.stringify({ email, password, remember }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = {
        400: data.error || "Please provide both email and password.",
        401: "The e-mail and password you provided did not match any of our records. Please, try again.",
        500: "An error occurred. Please, try again.",
      };

      throw new Error(errorMessage[response.status]);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "An error occurred. Please, try again.");
  }
}

export async function signUser(formData) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/accounts/signup/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await response.json();

    if (!response.ok && response.status !== 400) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function performLogout() {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/accounts/logout/`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Something went wrong while logging out.");
    }

    return response.json();
  } catch (error) {
    throw new Error(
      error.message ||
        "An unexpected error occurred while logging out. Please, try again later.",
  }
}

export async function requestPasswordReset(email) {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/accounts/password-reset/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}
