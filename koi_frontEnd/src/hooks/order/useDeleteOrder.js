import { useMutation } from "@tanstack/react-query";
import { manageOrderServices } from "../../services/manageOderServices";

export const useDeleteOrder = () => {
    return useMutation({
      mutationFn: ({ userId, orderId }) => {
        console.log(userId); 
        console.log(orderId);
        return manageOrderServices.deleteOrderById(userId, orderId);
      }
    });
  };
  