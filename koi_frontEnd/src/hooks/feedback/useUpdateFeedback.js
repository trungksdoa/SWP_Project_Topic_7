import { useMutation } from "@tanstack/react-query"
import { manageFeedbackService } from "../../services/feedback/manageFeedbackService"

export const useUpdateFeedback = () => {
    return useMutation({
        mutationFn: (payload) => manageFeedbackService.putFeedback(payload)
    })
}