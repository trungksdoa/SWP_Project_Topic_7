import { apiInstanceHeader } from "../constant/apiInstanceHeader";
import { MANAGE_CART_API } from "../constant/api";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_CART_API,
});

export const manageCartService = {
  postCart: (payload) => api.post("", payload),
  getCart: (id) => api.get(`/user/${id}`),
  deleteCarts: ({ productId, userId }) =>
    api.delete(`/remove/${productId}/user/${userId}`),
};
