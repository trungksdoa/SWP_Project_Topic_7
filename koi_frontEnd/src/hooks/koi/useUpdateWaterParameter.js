import { useMutation } from "@tanstack/react-query";
import { manageWaterServices } from "../../services/koifish/manageWaterServices";

export const useUpdateWaterParameter = () => {
  return useMutation({
    mutationFn: ({ id, payload }) =>
      manageWaterServices.putWaterParameter(id, payload),
  });
};
