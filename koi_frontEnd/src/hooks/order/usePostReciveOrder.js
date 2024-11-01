import { useMutation } from "@tanstack/react-query"
import { manageOrderServices } from "../../services/manageOderServices"

export const usePostReciveOrder = () => {
    return useMutation({
        mutationFn: (payload) => manageOrderServices.receiveOrder(payload)
    })
}