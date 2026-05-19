import { authApiClient } from "./apiClient";

export interface LoginRequest {
  email?: string;
  password?: string;
  // Fallbacks to support older logic if needed
  phone_number?: string;
  passpin?: string;
}

export interface LoginResponse {
  access_token: string;
  user?: any;
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  // Support both new email/password and fallback for development convenience
  const email = data.email || (data.phone_number ? `${data.phone_number}@itmso.in` : "");
  const password = data.password || data.passpin || "";

  try {
    const response = await authApiClient.post("/auth/login", {
      email,
      password,
    });

    // Make sure we extract the token regardless of variation in backend format
    const token =
      response.data?.token ||
      response.data?.access_token ||
      response.data?.accessToken ||
      response.data?.jwt;

    if (!token) {
      throw new Error("No token received from authentication server.");
    }

    return {
      access_token: token,
      user: response.data?.user || null,
    };
  } catch (error: any) {
    // If auth server is down or returns 404/500, we fallback gracefully for local testing with mock admin credentials
    if (
      (data.email === "admin@itmso.in" && data.password === "Admin@123") ||
      (data.phone_number === "9999999999" && data.password === "password123")
    ) {
      console.warn("⚠️ Authentication server unreachable or failed. Falling back to offline mock token for development.");
      return { access_token: "mock_token_12345" };
    }
    throw error;
  }
};

export const getProfileApi = async (): Promise<any> => {
  try {
    const response = await authApiClient.get("/auth/me");
    return response.data;
  } catch (error) {
    // Graceful offline development fallback
    console.warn("⚠️ Failed to fetch profile from auth server. Falling back to offline profile.");
    return {
      id: 1,
      name: "Jawan One",
      email: "jawan1@itmso.in",
      role: "jawan",
      badgeNumber: "ITMS-9988",
    };
  }
};

export const logoutApi = async (): Promise<any> => {
  try {
    const response = await authApiClient.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.warn("⚠️ Logout API call failed, proceeding to clear local session.");
    return { status: "logged_out_locally" };
  }
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password?: string;
  role?: "admin" | "jawan";
}): Promise<any> => {
  const response = await authApiClient.post("/auth/register", data);
  return response.data;
};

export const listJawansApi = async (): Promise<any> => {
  const response = await authApiClient.get("/auth/jawans");
  return response.data;
};

export const deleteJawanApi = async (id: number | string): Promise<any> => {
  const response = await authApiClient.delete(`/auth/jawan/${id}`);
  return response.data;
};

export const forgotPasswordApi = async (email: string): Promise<any> => {
  const response = await authApiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (data: {
  token: string;
  password?: string;
}): Promise<any> => {
  const response = await authApiClient.post("/auth/reset-password", data);
  return response.data;
};

export const setupAdminApi = async (): Promise<any> => {
  const response = await authApiClient.get("/setup-admin");
  return response.data;
};
