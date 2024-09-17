import { useQuery } from "@tanstack/react-query"
import { ManageUserAll } from "../../services/admin/ManageUserAll"
export const useGetUserAll = () => {
    const q = useQuery({
        queryKey: ['user-all'],
        queryFn: () => ManageUserAll.getUserAll()
    })
    return { 
        ...q,
        data: q.data?.data?.data?.content
     }
}