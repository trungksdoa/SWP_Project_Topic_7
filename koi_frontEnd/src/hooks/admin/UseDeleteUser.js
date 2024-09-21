import { useMutation } from "@tanstack/react-query";
import { ManageUserAll } from "../../services/admin/ManageUserAll";
export const useDeleteUser = () => {
    return useMutation({
        mutationFn: (id) => ManageUserAll.deleteUser(id)
    })
}