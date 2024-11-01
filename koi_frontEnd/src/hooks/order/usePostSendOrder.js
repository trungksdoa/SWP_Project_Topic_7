import { useMutation } from "@tanstack/react-query";
import { manageOrderServices } from "../../services/manageOderServices";

export const usePostSendOrder = () => {
  return useMutation({
    mutationFn: (payload) => manageOrderServices.postSendOrder(payload),
  });
};
