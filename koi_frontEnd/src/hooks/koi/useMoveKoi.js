import { useMutation } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useMoveKoi = () => {
    return useMutation({
        mutationFn: ({ id, payload, isNew }) => manageKoiFishServices.moveKoi(id, payload, isNew)
    })
}
