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
    addKoi: async (payload) => {
        console.log("Payload received in addKoi:", payload); // Add this line for debugging

        // Check if payload is already a FormData object
        if (payload instanceof FormData) {
            try {
                const response = await api.post("", payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            } catch (error) {
                console.error('Error in addKoi:', error);
                throw error.response?.data || error.message;
            }
        } else {
            // If payload is not FormData, create a new FormData object
            const formData = new FormData();
            
            if (typeof payload.fish === 'object') {
                formData.append('fish', JSON.stringify(payload.fish));
            } else if (typeof payload.fish === 'string') {
                formData.append('fish', payload.fish);
            } else {
                console.error('Invalid fish data:', payload.fish); // Add this line for debugging
                throw new Error('Invalid fish data');
            }

            if (payload.image) {
                formData.append('image', payload.image);
            }

            try {
                const response = await api.post("", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data;
            } catch (error) {
                console.error('Error in addKoi:', error);
                throw error.response?.data || error.message;
            }
        }
    },
    deleteKoi: (id) => api.delete(`/${id}`),
    updateKoiPond: (id, payload) => api.put(`/${id}`, payload),
    // addGrowth: (id, payload) => api.post(`/growthUpHistory/${id}`, payload),
    // showGrowth: (id) => api.get(`/growthUpHistory/${id}`)
}