import { MANAGE_BLOGS_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_BLOGS_API
})

export const manageBlogsServicesH = {
    postBlog: (payload) => api.post("", payload),
    putBlog: (id,payload) => api.put(`/${id}`, payload),
    getBlogsByAuthorId: (id) => api.get(`/author/${id}`),
    getBlogById: (id) => api.get(`${id}`)
}