import axios, { AxiosInstance } from "axios";
import { Config } from "@/config";
import { useAuthStore } from "@/store/authStore";

// Traffic API client
export const apiClient = axios.create({
  baseURL: Config.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": Config.apiKey,
  },
  timeout: 10000, // 10 second timeout for hardware responses
});

// Authentication API client
export const authApiClient = axios.create({
  baseURL: Config.authUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to attach bearer token and log requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`\n======================================================`);
    console.log(`[📡 AXIOS TRAFFIC REQUEST] Sending: ${config.method?.toUpperCase()} to ${config.baseURL}${config.url}`);
    if (config.params) {
      console.log(`[📡 AXIOS PARAMS]:`, JSON.stringify(config.params, null, 2));
    }
    if (config.data) {
      console.log(`[📡 AXIOS BODY]:`, JSON.stringify(config.data, null, 2));
    }
    console.log(`======================================================`);
    return config;
  },
  (error) => {
    console.error(`\n[❌ AXIOS TRAFFIC REQUEST SETUP ERROR]:`, error);
    return Promise.reject(error);
  }
);

authApiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`\n======================================================`);
    console.log(`[📡 AXIOS AUTH REQUEST] Sending: ${config.method?.toUpperCase()} to ${config.baseURL}${config.url}`);
    if (config.params) {
      console.log(`[📡 AXIOS PARAMS]:`, JSON.stringify(config.params, null, 2));
    }
    if (config.data) {
      // Avoid printing sensitive passwords in plain logs
      const safeData = { ...config.data };
      if (safeData.password) {
        safeData.password = "********";
      }
      console.log(`[📡 AXIOS BODY]:`, JSON.stringify(safeData, null, 2));
    }
    console.log(`======================================================`);
    return config;
  },
  (error) => {
    console.error(`\n[❌ AXIOS AUTH REQUEST SETUP ERROR]:`, error);
    return Promise.reject(error);
  }
);

// Response interceptors helper
const setupResponseInterceptor = (client: AxiosInstance, name: string) => {
  client.interceptors.response.use(
    (response) => {
      console.log(`\n======================================================`);
      console.log(`[✅ AXIOS ${name} RESPONSE SUCCESS] ${response.status} from ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log(`[✅ AXIOS DATA RECEIVED]:`, JSON.stringify(response.data, null, 2));
      console.log(`======================================================`);
      return response;
    },
    (error) => {
      const message = error.response?.data?.error || error.response?.data?.message || error.message || "Unknown network error";
      console.error(`\n======================================================`);
      console.error(`[❌ AXIOS ${name} RESPONSE FAILURE]`);
      console.error(`[❌ URL]: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error(`[❌ STATUS CODE]: ${error.response?.status || "NO_CONNECTION"}`);
      console.error(`[❌ ERROR MESSAGE]: "${message}"`);
      if (error.response?.data) {
        console.error(`[❌ SERVER RAW ERROR]:`, JSON.stringify(error.response.data, null, 2));
      }
      console.error(`======================================================`);

      const customError = new Error(message) as any;
      customError.status = error.response?.status;
      customError.data = error.response?.data;
      return Promise.reject(customError);
    }
  );
};

setupResponseInterceptor(apiClient, "TRAFFIC");
setupResponseInterceptor(authApiClient, "AUTH");
