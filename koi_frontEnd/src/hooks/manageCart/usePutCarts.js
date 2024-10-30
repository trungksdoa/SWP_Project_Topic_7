import { useMutation } from "@tanstack/react-query";
import { manageCartService } from "../../services/manageCartServices";

export const usePutCarts = () => {
    return useMutation({
        mutationFn: ({id, payload}) => {
            return manageCartService.putCart(id, payload)
        }
    })
}