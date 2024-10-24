import { useMutation } from "@tanstack/react-query"
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices"

export const useUpdateKoi = () => {
    return useMutation({
        mutationFn: ({ id, payload, isNew }) => manageKoiFishServices.updateKoi(id, payload, isNew)
    })
}
