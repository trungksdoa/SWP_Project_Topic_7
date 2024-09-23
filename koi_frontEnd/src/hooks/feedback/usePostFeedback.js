import { useMutation } from "@tanstack/react-query"
import { manageFeedbackService } from "../../services/feedback/manageFeedbackService"

export const usePostFeedBack = () => {
    return useMutation({
        mutationFn: (payload) => manageFeedbackService.postFeedback(payload)
    })
}