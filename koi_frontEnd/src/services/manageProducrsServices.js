import { MANAGE_PRODUCTS_API } from "../constant/api";
import { apiInstance } from "../constant/apiInstance";
const api = apiInstance.create({
    baseURL: MANAGE_PRODUCTS_API
})

export const manageProductsServices = {
    getAllProducts: () => api.get(""),
    getProductById: (id) => api.get(`/${id}`)
}