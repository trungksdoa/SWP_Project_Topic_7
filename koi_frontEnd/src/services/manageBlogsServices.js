import { MANAGE_BLOGS_API } from "../constant/api";
import { apiInstance } from "../constant/apiInstance";

const api = apiInstance.create({
    baseURL: MANAGE_BLOGS_API
})

export const manageBlogsServices = {
    getAllBlogs: () => api.get(""),
    getBlogsBySlug: (slug) => api.get(`/title/${slug}`)
}
