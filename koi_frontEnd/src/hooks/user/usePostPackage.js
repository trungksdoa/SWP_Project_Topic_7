import { useMutation } from "@tanstack/react-query"
import { manageUserServicesH } from "../../services/admin/manageUserServiceH"

export const usePostPackage = () => {
    return useMutation({
        mutationFn: (payload) => manageUserServicesH.addPackage(payload)
    })
}