import { MANAGE_PACKAGE_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_PACKAGE_API
})

export const managePackageServiceH = {
    getPackage: () => api.get("/list"),
    getPackageById: (id) => api.get(`/${id}`),
    putPackage: (id, payload) => api.put(`/${id}`, payload),
    deletePackage: (id) => api.delete(`/${id}`)
}