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
  getAllOrder: () => api.get(''),
  postSendOrder: (id) => api.post(`/send-order?orderId=${id}`),
  receiveOrder: (id) => api.post(`/receive-order?orderId=${id}`),
  getOrderById: (id) => api.get(`/${id}`),

  // http://localhost:8080/api/admin/dashboard/order-status?startDate=2023%2F10%2F01&endDate=2024%2F10%2F21

  getOrderStatusChart: (startDate, endDate) =>
    dashboardApi.get(`/order-status?startDate=${startDate}&endDate=${endDate}`),
  
  getTotalSales: (startDate, endDate) =>
    dashboardApi.get(`/total-sales?startDate=${startDate}&endDate=${endDate}`),
};

