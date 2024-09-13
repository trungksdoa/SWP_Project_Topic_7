import { useQuery } from "@tanstack/react-query"
import { manageUserServices } from "../../services/manageUserServices"

export const useGetUserAll = () => {
    const q = useQuery({
        queryKey: ['user-all'],
        queryFn: () => manageUserServices.getUserAll()
    })
    return { 
        ...q,
        data: q.data?.data?.data?.content
     }
}