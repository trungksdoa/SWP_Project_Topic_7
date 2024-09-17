import { MANAGE_USER_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_USER_API,
});

export const ManageUserAll = {
  getUserAll: () => api.get("/manage/api/users"),
};
