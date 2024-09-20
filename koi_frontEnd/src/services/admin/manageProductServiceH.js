import { MANAGE_PRODUCTS_ADMIN_API } from "../../constant/api"
import { apiInstanceHeader } from "../../constant/apiInstanceHeader"

const api = apiInstanceHeader.create({
    baseURL: MANAGE_PRODUCTS_ADMIN_API
})

export const manageProductServiceH = {
    deleteProduct: (id) => api.delete(`/${id}`)
}