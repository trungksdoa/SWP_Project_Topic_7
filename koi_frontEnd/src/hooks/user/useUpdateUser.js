import { useMutation } from "@tanstack/react-query"
import { manageUserServicesH } from "../../services/admin/manageUserServiceH"

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({id, payload}) => manageUserServicesH.updateUser(id, payload)
    })
}