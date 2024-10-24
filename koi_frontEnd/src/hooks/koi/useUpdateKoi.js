import { useMutation } from "@tanstack/react-query"
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices"

export const useUpdateKoi = () => {
    return useMutation({
        mutationFn: ({id, payload}) => manageKoiFishServices.updateKoi(id, payload)
    })
}
