import { MANAGE_WATERPARAMETER_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_WATERPARAMETER_API
});

export const manageWaterServices = {
    getWaterByPondId: (pondId) => api.get(`/api/ponds/parameters/${pondId}`),
    postWaterById: (id, payload) => api.post(`/api/ponds/parameters/${id}`, payload),
    getWaterStandard: (id) => api.get(`/api/ponds/parameters/standard/${id}`),
    putWaterParameter: (id, payload) => api.put(`/api/ponds/parameters/${id}`, payload)
};
