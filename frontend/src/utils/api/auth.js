import { fetchWithErrorHandling } from ".";
import { BACKEND_URL, UNEXPECTED_ERROR, API_ENDPOINTS } from "./constants";

async function refreshToken() {
  try {
    const response = await fetch(
      `${BACKEND_URL}${API_ENDPOINTS.TOKEN_REFRESH}`,
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
    const response = await fetch(
      `${BACKEND_URL}${API_ENDPOINTS.TOKEN_VERIFY}`,
      {
        method: "POST",
        credentials: "include",
      },
    );

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
    return await fetchWithErrorHandling(API_ENDPOINTS.LOGIN, {
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
      API_ENDPOINTS["SIGNUP"],
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
    return await fetchWithErrorHandling(API_ENDPOINTS.LOGOUT, {
      method: "POST",
    });
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function requestPasswordReset(email) {
  try {
    return await fetchWithErrorHandling(API_ENDPOINTS.PASSWORD_RESET, {
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
      `${API_ENDPOINTS.PASSWORD_RESET_SET}${uid}/${token}/`,
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
