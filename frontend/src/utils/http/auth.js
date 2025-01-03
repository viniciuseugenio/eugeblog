const { VITE_BASE_BACKEND_URL } = import.meta.env;

async function refreshToken() {
  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/api/token/refresh/`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      return false;
    } else {
      return true;
    }
  } catch {
    return false;
  }
}

export async function fetchWithToken(url, options, retryCount = 1) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401 && retryCount > 0) {
    const refreshed = await refreshToken();

    if (!refreshed) {
      throw new Error("You are not authorized to access this resource.");
    }

    return fetchWithToken(url, options, retryCount - 1);
  }

  return response;
}

export async function isUserAuthenticated() {
  const VERIFY_URL = `${VITE_BASE_BACKEND_URL}/api/token/verify/`;

  async function verifyToken() {
    try {
      return await fetch(VERIFY_URL, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error verifying token:", error);
      throw error;
    }
  }

  try {
    const response = await verifyToken();

    if (response.ok) {
      const data = await response.json();
      return { isAuthenticated: true, userId: data.user_id };
    }

    const refreshed = await refreshToken();

    if (refreshed) {
      const retryResponse = await verifyToken();

      if (retryResponse.ok) {
        const data = await retryResponse.json();
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
  const form = {
    email: formData.get("email"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    agree: formData.get("agree"),
  };

  try {
    const response = await fetch(
      `${VITE_BASE_BACKEND_URL}/accounts/api/signup/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
      `${VITE_BASE_BACKEND_URL}/accounts/api/logout/`,
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
    );
  }
}
