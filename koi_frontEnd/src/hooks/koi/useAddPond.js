import { useMutation } from "@tanstack/react-query";
import { managePondServices } from "../../services/koifish/managePondServices";

export const useAddPond = () => {
  return useMutation({
    mutationFn: (payload) => managePondServices.addPond(payload),
  });
};
