import { MANAGE_POND_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_POND_API
});

export const managePondServices = {
    getAllPond: () => api.get("/listpond"),
    getPondById: (pondId) => api.get(`/${pondId}`),
};