import { useMutation } from "@tanstack/react-query"
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices"

export const useDeleteKoi = ( ) => {
    return useMutation({
        mutationFn: (id) => manageKoiFishServices.deleteKoi(id)
    })
}