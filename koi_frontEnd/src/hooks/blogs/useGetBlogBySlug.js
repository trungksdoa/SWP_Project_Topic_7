import { useQuery } from "@tanstack/react-query"
import { manageBlogsServices } from "../../services/manageBlogsServices"

export const useGetBlogBySlug = (slug) => {
    const q = useQuery({
        queryKey: ['Get-Blog-by-Slug'],
        queryFn: () => manageBlogsServices.getBlogsBySlug(slug)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}