import { useMutation } from "@tanstack/react-query"
import { managePackageServiceH } from "../../../services/admin/managePackageServiceH"

export const useDeletePackage = () => {
    return useMutation({
        mutationFn: (id) => managePackageServiceH.deletePackage(id)
    })
}