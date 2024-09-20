import axios from "axios";
import { getUserLogin } from "../utils/getUserLogin";

export const apiInstanceHeader = {
  create: (configDefault) => {
    const api = axios.create(configDefault);
    api.interceptors.request.use((config) => {
      return {
        ...config,
        headers: {
          Authorization: `Bearer ${getUserLogin()?.accessToken}`,
        },
      };
    });
    return api;
  },
};
