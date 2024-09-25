import { useMutation } from "@tanstack/react-query"
import { manageProductServiceH } from "../../../services/admin/manageProductServiceH"

export const usePutProduct = () => {
    return useMutation({
        mutationFn: ({id, payload}) => {
            return manageProductServiceH.editProduct(id, payload)
        }
    })
}