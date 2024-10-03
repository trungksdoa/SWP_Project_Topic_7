import { useMutation } from "@tanstack/react-query"
import { manageBlogsServicesH } from "../../services/shop/manageBlogServicesH"

export const usePostBlog = () => {
    return useMutation({
        mutationFn: (payload) => manageBlogsServicesH.postBlog(payload)
    })
}