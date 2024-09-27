import { MANAGE_ORDER_API } from "../constant/api";
import { apiInstanceHeader } from "../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_ORDER_API,
});
 
export const manageOrderServices = {
    postOrder: (payload) => api.post('/create-product-order', payload)
}