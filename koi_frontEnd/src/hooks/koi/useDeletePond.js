import { useMutation, useQueryClient } from "@tanstack/react-query"
import { managePondServices } from "../../services/koifish/managePondServices"

export const useDeletePond = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => managePondServices.deletePond(id),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('ponds');
        },
    })
}