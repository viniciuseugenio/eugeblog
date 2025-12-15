import { apiRequest } from ".";
import { API_ENDPOINTS, UNEXPECTED_ERROR } from "./constants";

export async function refreshToken(): Promise<boolean> {
  try {
    await apiRequest(API_ENDPOINTS.TOKEN_REFRESH, {
      method: "POST",
    });
    return true;
  } catch (error) {
    console.error("Failed to refresh the token:", error);
    return false;
  }
}

export async function verifyUser() {
  return apiRequest<{ authenticated: boolean; user: any }>(
    API_ENDPOINTS.TOKEN_VERIFY,
    {
      method: "POST",
      requiresAuth: true,
    },
  );
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean,
) {
  return await apiRequest<{ detail: string; user: any }>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password, rememberMe }),
  });
}

export async function signUser(formData: any) {
  try {
    return await apiRequest<{ detail: string }>(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      body: JSON.stringify(formData),
      returnBadRequest: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function logout() {
  try {
    return await apiRequest(API_ENDPOINTS.LOGOUT, {
      method: "POST",
    });
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function requestPasswordReset(email: string) {
  try {
    return await apiRequest<{ detail: string }>(API_ENDPOINTS.PASSWORD_RESET, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    throw new Error(error.message || UNEXPECTED_ERROR);
  }
}

export async function resetPassword({ uid, token, formData }) {
  try {
    return await apiRequest<{ detail: string }>(
      `${API_ENDPOINTS.PASSWORD_RESET_SET}${uid}/${token}/`,
      {
        method: "POST",
        body: JSON.stringify(formData),
        returnBadRequest: true,
      },
    );
  } catch (error) {
    throw new Error(error.message || "An unexpected error occured"); // Replace with variable
  }
}
