import { useQuery } from "@tanstack/react-query"
import { manageFeedbackService } from "../../services/feedback/manageFeedbackService"

export const useGetFeedbackById = (id) => {
    const q = useQuery({
        queryKey: ['GetFeedback'],
        queryFn: () => manageFeedbackService.getFeedbacById(id)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}