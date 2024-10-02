import { MANAGE_KOI_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";


const api = apiInstanceHeader.create({
    baseURL: MANAGE_KOI_API
})

export const manageKoiFishServices = {
    getAllKoi: () => api.get("/listkoi"),
    getKoiByUserId: (id) => api.get(`/listkoi/byuserid/${id}`),
    updateKoi: async (id, payload) => {
        try {
          const response = await api.put(`/${id}`, payload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          return response.data;
        } catch (error) {
          throw error.response?.data || error.message;
        }
    },
}