import { MANAGE_USER_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";
import { DASHBOARD_API } from "../../constant/api";
const api = apiInstanceHeader.create({
  baseURL: MANAGE_USER_API,
});

const dashboardApi = apiInstanceHeader.create({
  baseURL: DASHBOARD_API,
});

export const ManageUserAll = {
  getAllUserPage: (page, size) =>
    api.get(`/manage/api/users/page?page=${page}&size=${size}`),
  getUserAll: () => api.get("/manage/api/users"),
  deleteUser: (id) => api.delete(`/manage/api/users/${id}`),
  getUserGrowth: (startDate, endDate) =>
    dashboardApi.get(`/user-growth?startDate=${startDate}&endDate=${endDate}`),
};
