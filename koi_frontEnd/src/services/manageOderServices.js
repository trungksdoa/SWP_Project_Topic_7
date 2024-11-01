import { MANAGE_ORDER_API } from "../constant/api";
import { apiInstanceHeader } from "../constant/apiInstanceHeader";
import { DASHBOARD_API } from "../constant/api";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_ORDER_API,
});

const dashboardApi = apiInstanceHeader.create({
  baseURL: DASHBOARD_API,
});

export const manageOrderServices = {
  postOrder: (payload) => api.post("/create-product-order", payload),
  getOrderByUserId: (id) => api.get(`/user/${id}/list`),
  deleteOrderById: (userId, orderId) => {
    return api.delete(`/user/${userId}/order/${orderId}`);
  },
  getReceiptOrder: (id) => api.get(`/receive-order?orderId=${id}`),
  getAllOrder: () => api.get(""),
  postSendOrder: (payload) => {
    return api.post("/send-order", payload)
  },
  receiveOrder: (id) => api.post(`/receive-order`, id),
  getOrderById: (id) => api.get(`/${id}`),
  getOrderStatusChart: (startDate, endDate) =>
    dashboardApi.get(`/order-status?startDate=${startDate}&endDate=${endDate}`),
  getTotalSales: (startDate, endDate) =>
    dashboardApi.get(`/total-sales?startDate=${startDate}&endDate=${endDate}`),
};
