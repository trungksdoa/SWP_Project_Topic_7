import { MANAGE_ORDER_API } from "../constant/api";
import { apiInstanceHeader } from "../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_ORDER_API,
});

export const manageOrderServices = {
  postOrder: (payload) => api.post("/create-product-order", payload),
  getOrderByUserId: (id) => api.get(`/user/${id}/list`),
  deleteOrderById: (userId, orderId) => {
    console.log(userId)
    console.log(orderId)
    return api.delete(`/user/${userId}/order/${orderId}`);
  },
  getReceiptOrder: (id) => api.get(`/receive-order?orderId=${id}`),
  getAllOrder: () => api.get(''),
  postSendOrder: (id) => api.post(`/send-order?orderId=${id}`)
};
