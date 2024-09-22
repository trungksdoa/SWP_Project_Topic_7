import { MANAGE_PRODUCTS_ADMIN_API } from "../../constant/api"
import { apiInstanceHeader } from "../../constant/apiInstanceHeader"

const api = apiInstanceHeader.create({
    baseURL: MANAGE_PRODUCTS_ADMIN_API
})

export const manageProductServiceH = {
    deleteProduct: (id) => api.delete(`/${id}`),
    addProduct: (payload) => api.post('', payload),
    editProduct: (id ,payload) => {
        console.log(id)
        console.log(payload)
        return api.put(`/${id}`, payload)
    }
}