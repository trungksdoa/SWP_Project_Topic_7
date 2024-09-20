import { useMutation } from "@tanstack/react-query"
import { manageProductServiceH } from "../../../services/admin/manageProductServiceH"
export const useDeleteProduct = () => {
    return useMutation({
        mutationFn: (id) => manageProductServiceH.deleteProduct(id)
    })
}