import { MANAGE_CATEGORY_API_ADMIN } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_CATEGORY_API_ADMIN
})

export const manageCatgegoryServiceAdmin = {
    getCategoryById: (id) => api.get(`/${id}`),
    editCategory: (id, payload) => api.put(`/${id}`, payload),
    delete: (id) => api.delete(`/${id}`)
}