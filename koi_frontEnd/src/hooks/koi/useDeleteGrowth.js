import { useMutation } from "@tanstack/react-query"
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices"

export const useDeleteGrowth = ( ) => {
    return useMutation({
        mutationFn: (id) => manageKoiFishServices.deleteGrowth(id)
    })
}