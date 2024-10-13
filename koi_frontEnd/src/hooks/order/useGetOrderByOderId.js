import { useQuery } from "@tanstack/react-query"
import { manageOrderServices } from "../../services/manageOderServices"

export const useGetOrderByOderId = (id) => {
    const q = useQuery({
        queryKey: ['Get-Order-by-order-id'],
        queryFn: () => manageOrderServices.getOrderById(id)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}