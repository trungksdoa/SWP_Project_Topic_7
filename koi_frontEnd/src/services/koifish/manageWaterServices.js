import { MANAGE_WATERPARAMETER_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_WATERPARAMETER_API
});

export const manageWaterServices = {
    getWaterByPondId: (pondId) => api.get(`/api/ponds/parameters/${pondId}`),
};
