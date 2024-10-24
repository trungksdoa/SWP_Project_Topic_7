import { MANAGE_CATEGORY_API } from "../../constant/api";
import { apiInstance } from "../../constant/apiInstance";

const api = apiInstance.create({
    baseURL: MANAGE_CATEGORY_API
})

export const manageCategoryServices = {
    getCategory: () => api.get('/list'),
    
}