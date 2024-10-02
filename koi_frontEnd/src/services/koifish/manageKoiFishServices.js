import { MANAGE_KOI_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_KOI_API
})

export const manageKoiFishServices = {
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
    addKoi: async (payload) => {
      try {
          const formData = new FormData();            
          formData.append('koi', JSON.stringify(payload.koi));
          if (payload.image) {
              formData.append('image', payload.image);
          }

          const response = await api.post("", formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          return response.data;
      } catch (error) {
          throw error.response?.data || error.message;
      }
  }
}