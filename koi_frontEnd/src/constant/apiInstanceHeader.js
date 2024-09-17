import axios from "axios";
import { getUserLogin } from "../utils/getUserLogin";

export const apiInstanceHeader = {
  create: (configDefault) => {
    const api = axios.create(configDefault);
    api.interceptors.request.use((config) => {
      console.log(config);
      console.log("Bearer " + getUserLogin()?.accessToken);
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
