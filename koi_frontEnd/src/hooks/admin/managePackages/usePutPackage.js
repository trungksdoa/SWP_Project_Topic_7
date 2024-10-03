import { useMutation } from "@tanstack/react-query"
import { managePackageServiceH } from "../../../services/admin/managePackageServiceH"

export const usePutPackage = () => {
    return useMutation({
        mutationFn: ({id, payload}) => managePackageServiceH.putPackage(id, payload)
    })
}