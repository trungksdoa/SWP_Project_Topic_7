import { MANAGE_KOI_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader.js";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_KOI_API
})

export const manageKoiFishServices = {
    getKoiByPondId: (id) => api.get(`/listkoi/bypondid/${id}`),
    getKoiByUserId: (id) => api.get(`/listkoi/byuserid/${id}/page?page=0&size=10`),
    getKoiByKoiId: (id) => api.get(`/${id}`),
    updateKoi: async (id, payload, isNew = false) => {
        const url = `/${id}?isNew=${isNew}`;
        const response = await api.put(url, payload);
        return response.data;
    },
    moveKoi: async (id, payload, isNew = true) => {
        const url = `/${id}?isNew=${isNew}`;
        const response = await api.put(url, payload);
        return response.data;
    },
    addKoi: async (payload) => {

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
    deleteGrowth: (id) => api.delete(`/growthUpHistory/${id}`),
    deleteKoi: (id) => api.delete(`/${id}`),
    updateKoiPond: (id, payload) => api.put(`/${id}`, payload),
    addGrowth: async (id, payload) => {
        const formData = new FormData();
        
        if (typeof payload.fishgrow === 'object') {
            formData.append('fishgrow', JSON.stringify(payload.fishgrow));
        } else if (typeof payload.fishgrow === 'string') {
            formData.append('fishgrow', payload.fishgrow);
        } else {
            console.error('Invalid fish data:', payload.fishgrow);
            throw new Error('Invalid fish data');
        }

        const url = `/growthUpHistory/${id}`;

        try {
            const response = await api.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error in addGrowth:', error);
            throw error.response?.data || error.message;
        }
    },
    getGrowth: (id) => {
        console.log(id)
       return api.get(`/growthUpHistory/${id}`);
    }
}
