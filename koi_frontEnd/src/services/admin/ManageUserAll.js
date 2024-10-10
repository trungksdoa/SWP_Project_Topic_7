import { MANAGE_USER_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_USER_API,
});

export const ManageUserAll = {
  getAllUserPage: (page, size) => api.get(`/manage/api/users/page?page=${page}&size=${size}`),
  getUserAll: () => api.get("/manage/api/users"),
  deleteUser: (id) => api.delete(`/manage/api/users/${id}`)
};
