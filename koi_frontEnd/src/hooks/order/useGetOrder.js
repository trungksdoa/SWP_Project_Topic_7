import { useQuery } from "@tanstack/react-query"
import { manageOrderServices } from "../../services/manageOderServices"

export const useGetOrder = (id) => {
    const q = useQuery({
        queryKey: ['Get-order'],
        queryFn: () => manageOrderServices.getOrderByUserId(id)
    })
    return {
        ...q, 
        data: q?.data?.data?.data
    }
}