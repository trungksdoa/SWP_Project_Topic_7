import { MANAGE_USER_API } from "../constant/api";
import { apiInstance } from "../constant/apiInstance";
const api = apiInstance.create({
    baseURL: MANAGE_USER_API
})

export const manageUserServices = {
    login: (payload) => api.post("/api/users/auth/login", payload),
    register: (payload) => api.post("/api/users/auth/register", payload),
    deleteUser: (id) => api.delete(`/manage/api/users/${id}`)
}