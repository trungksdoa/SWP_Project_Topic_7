import { MANAGE_USER_API } from "../constant/api";
import { apiInstance } from "../constant/apiInstance";
const api = apiInstance.create({
    baseURL: MANAGE_USER_API
})

export const manageUserServices = {
    login: (payload) => api.post("/login", payload),
    register: (payload) => api.post("/register", payload),
}