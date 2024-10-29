import { MANAGE_PRODUCTS_ADMIN_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";
import { DASHBOARD_API } from "../../constant/api";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_PRODUCTS_ADMIN_API,
});

const dashboardApi = apiInstanceHeader.create({
  baseURL: DASHBOARD_API,
});

export const manageProductServiceH = {
  deleteProduct: (id) => api.delete(`/${id}`),
  addProduct: (payload) => api.post("", payload),
  editProduct: (id, payload) => {
    return api.put(`/${id}`, payload);
  },
  getTopSaleProduct: (startDate, endDate) =>
    dashboardApi.get(
      `/top-selling-products?startDate=${startDate}&endDate=${endDate}`
    ),
};
