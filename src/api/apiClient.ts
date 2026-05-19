import axios from "axios";
import { Config } from "@/config";

export const apiClient = axios.create({
  baseURL: Config.apiUrl,
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": Config.apiKey,
  },
  timeout: 10000, // 10 second timeout for hardware responses
});

// Request logging interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`\n======================================================`);
    console.log(`[📡 AXIOS REQUEST] Sending: ${config.method?.toUpperCase()} to ${config.baseURL}${config.url}`);
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
    console.error(`\n[❌ AXIOS REQUEST SETUP ERROR]:`, error);
    return Promise.reject(error);
  }
);

// Response logging interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`\n======================================================`);
    console.log(`[✅ AXIOS RESPONSE SUCCESS] ${response.status} from ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log(`[✅ AXIOS DATA RECEIVED]:`, JSON.stringify(response.data, null, 2));
    console.log(`======================================================`);
    return response;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || "Unknown network error";
    console.error(`\n======================================================`);
    console.error(`[❌ AXIOS RESPONSE FAILURE]`);
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
