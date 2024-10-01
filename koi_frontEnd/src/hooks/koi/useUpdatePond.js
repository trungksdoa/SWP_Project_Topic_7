import { useMutation } from "@tanstack/react-query"
import { managePondServices } from "../../services/koifish/managePondServices"

export const useUpdatePond = () => {
    return useMutation({
        mutationFn: ({id, payload, userId}) => managePondServices.updatePond(id, payload, userId)
    })
}