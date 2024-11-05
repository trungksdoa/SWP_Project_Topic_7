import { useQuery } from "@tanstack/react-query"
import { manageOrderServices } from "../../services/manageOderServices"

export const useGetFeedbackOrder = (prdId) => {
    const q = useQuery({
        queryKey: ['Get-feedback-order'],
        queryFn: () => manageOrderServices.getFeedbackOrder(prdId)
    })
    return {
        ...q, 
        data: q?.data?.data?.data
    }
}