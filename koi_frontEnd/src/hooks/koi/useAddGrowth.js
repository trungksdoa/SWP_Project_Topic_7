import { useMutation } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useAddGrowth = () => {
  return useMutation({
    mutationFn: ({ id, payload, isNew }) => manageKoiFishServices.addGrowth(id, payload, isNew)
  });
};
