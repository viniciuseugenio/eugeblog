import { fetchWithErrorHandling } from ".";

const UNEXPECTED_ERROR = "An unexpected error occurred. Please, try again.";
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
    return await fetchWithErrorHandling("/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, remember }),
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function signUser(formData) {
  try {
    return await fetchWithErrorHandling(
      "/api/accounts/signup/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
      true, // Ignore 400 errors
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function performLogout() {
  try {
    return await fetchWithErrorHandling("/api/accounts/logout/", {
      method: "POST",
    });
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function requestPasswordReset(email) {
  try {
    return await fetchWithErrorHandling("/api/accounts/password-reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function resetPassword({ uid, token, formData }) {
  try {
    return await fetchWithErrorHandling(
      `/api/accounts/password-reset/set/${uid}/${token}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
      true,
    );
  } catch (error) {
    throw new Error(error.message || "An unexpected error occured"); // Replace with variable
  }
}
