import { useQuery } from "@tanstack/react-query"
import { manageBlogsServices } from "../../services/manageBlogsServices"

export const useGetAllBlogs = () => {
    const q = useQuery({
        queryKey: ['Get-all-blogs'],
        queryFn: () => manageBlogsServices.getAllBlogs()
    })
    return {
        ...q,
        data: q?.data?.data?.data

    }
}