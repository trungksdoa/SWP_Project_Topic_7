import { MANAGE_WATERPARAMETER_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_WATERPARAMETER_API
});

export const manageWaterServices = {
    getWaterByPondId: (pondId) => api.get(`/api/ponds/parameters/${pondId}`),
    postWaterById: (id, payload) => api.post(),
    getWaterStandard: (id) => api.get(`/api/ponds/parameters/standard/${id}`)
};
