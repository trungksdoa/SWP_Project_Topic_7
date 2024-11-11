import { MANAGE_API_SEARCH, MANAGE_PRODUCTS_API } from "../constant/api";
import { apiInstance } from "../constant/apiInstance";
const api = apiInstance.create({
    baseURL: MANAGE_PRODUCTS_API
})
const apiSearch = apiInstance.create({
    baseURL: MANAGE_API_SEARCH
})
export const manageProductsServices = {
    getAllProducts: () => api.get("/fetchAll"),
    getProductById: (id) => api.get(`/${id}`),
    getProductBySlug: (slug) => api.get(`/name/${slug}`),
    searchProduct: (payload) => {
        return apiSearch.post(`/name?name=${payload}`)
    }
}