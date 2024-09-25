import { useQuery } from "@tanstack/react-query"
import { manageUserServicesH } from "../../services/admin/manageUserServiceH"

export const useGetUserById = (id) => {
    const q = useQuery({
        queryKey: ['GetUserById'],
        queryFn: () => manageUserServicesH.getUserById(id)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}