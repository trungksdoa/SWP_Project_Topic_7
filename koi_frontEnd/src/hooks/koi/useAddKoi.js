import { useMutation } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useAddKoi = () => {
  return useMutation({
    mutationFn: (payload) => manageKoiFishServices.addKoi(payload),
  });
};
