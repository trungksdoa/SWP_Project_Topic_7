import { MANAGE_USER_API } from "../../constant/api"
import { apiInstanceHeader } from "../../constant/apiInstanceHeader"

const api = apiInstanceHeader.create({
    baseURL: MANAGE_USER_API
})

export const manageUserServicesH = {
    getUserById: (id) => api.get(`/api/users/${id}`),
    updateUser: (id, payload) => api.put(`/api/users/${id}`, payload)
}