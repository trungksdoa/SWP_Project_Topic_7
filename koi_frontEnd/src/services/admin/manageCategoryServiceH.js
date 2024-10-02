import { MANAGE_CATEGORY_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_CATEGORY_API
})

export const manageCategoryServices = {
    getCategory: () => api.get('/list'),
    
}