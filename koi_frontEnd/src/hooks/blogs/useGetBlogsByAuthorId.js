import { useQuery } from "@tanstack/react-query"
import { manageBlogsServicesH } from "../../services/shop/manageBlogServicesH"

export const useGetBlogsByAuthorId = (id) => {
    const q = useQuery({
        queryKey: ['Get-blog-by-author-id'],
        queryFn: () => manageBlogsServicesH.getBlogsByAuthorId(id)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}