import { useMutation } from "@tanstack/react-query";
import { manageUserServices } from "../../services/manageUserServices";
export const useDeleteUser = () => {
    return useMutation({
        mutationFn: (id) => manageUserServices.deleteUser(id)
    })
}