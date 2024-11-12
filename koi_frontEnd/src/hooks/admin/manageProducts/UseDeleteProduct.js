import { useMutation } from "@tanstack/react-query"
import { manageProductServiceH } from "../../../services/admin/manageProductServiceH"
export const useDeleteProduct = () => {
    return useMutation({
        mutationFn: (id) => manageProductServiceH.deleteProduct(id)
    })
}
export const useSoftDeleteProduct = () => {
    return useMutation({
        mutationFn: (id) => manageProductServiceH.softDeleteProduct(id)
    })
}

export const useRecoverProduct = () => {
    return useMutation({
        mutationFn: (id) => manageProductServiceH.recoveryProduct(id)
    })
}
