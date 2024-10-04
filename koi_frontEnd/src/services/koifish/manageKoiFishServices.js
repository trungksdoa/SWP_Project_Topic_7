import { MANAGE_KOI_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_KOI_API
})

export const manageKoiFishServices = {
    getKoiByUserId: (id) => api.get(`/listkoi/byuserid/${id}/page?page=0&size=10`),
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
    addKoi: (payload) => api.post("", payload),
    deleteKoi: (id) => api.delete(`/${id}`)
}