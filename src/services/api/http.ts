import axios from "axios";
import { ConfigService } from "../../config/config.service";
const configService = new ConfigService();
export const URL = configService.get("API_URL");
export const getContentType = () => ({
  "Content-Type": "application/json",
});

const api = axios.create({
  baseURL: URL,
  headers: getContentType(),
});

api.interceptors.request.use(async (config) => {
  const accessToken = configService.get("ACCESS_TOKEN");
  if (config.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
