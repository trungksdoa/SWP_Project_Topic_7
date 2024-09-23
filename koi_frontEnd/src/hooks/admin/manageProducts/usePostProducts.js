import { useMutation } from "@tanstack/react-query"
import { manageProductServiceH } from "../../../services/admin/manageProductServiceH"

export const usePostProducts = () => {
    return useMutation({
        mutationFn: (payload) => manageProductServiceH.addProduct(payload)
    })
}