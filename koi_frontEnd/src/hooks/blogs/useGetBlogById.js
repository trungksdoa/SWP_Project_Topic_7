import { useQuery } from "@tanstack/react-query"
import { manageBlogsServicesH } from "../../services/shop/manageBlogServicesH"

export const useGetBlogById = (id) => {
    const q = useQuery({
        queryKey: ['Get-blog-by-id'],
        queryFn: () => manageBlogsServicesH.getBlogById(id)

    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}