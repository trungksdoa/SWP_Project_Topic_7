import { useMutation } from "@tanstack/react-query";
import { manageWaterServices } from "../../services/koifish/manageWaterServices";

export const usePostWaterParameter = () => {
  return useMutation({
    mutationFn: ({ id, payload }) =>
      manageWaterServices.postWaterById(id, payload),
  });
};
