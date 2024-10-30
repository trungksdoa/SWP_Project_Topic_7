import { MANAGE_POND_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_POND_API
});

export const managePondServices = {
    getPondById: (id) => api.get(`/${id}`),
    getPondByUserId: (id) => api.get(`/listpond/byuserid/${id}`),
    updatePond: async (id, payload) => {
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
    addPond: async (payload) => {
        try {
            const formData = new FormData();            
            formData.append('pond', JSON.stringify(payload.pond));
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
    },
    deletePond: async (id) => {
        try {
            const response = await api.delete(`/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}