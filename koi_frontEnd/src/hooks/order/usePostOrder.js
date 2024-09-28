import { useMutation } from "@tanstack/react-query"
import { manageOrderServices } from "../../services/manageOderServices"

export const usePostOrder = () => {
    return useMutation({
        mutationFn: (payload) => manageOrderServices.postOrder(payload)
    })
}