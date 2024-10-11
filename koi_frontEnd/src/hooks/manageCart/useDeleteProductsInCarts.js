import { useMutation } from "@tanstack/react-query";
import { manageCartService } from "../../services/manageCartServices";

export const useDeleteProductsInCarts = () => {
  return useMutation({
    mutationFn: ({ productId, userId }) =>
      manageCartService.deleteCarts({ productId, userId }),
  });
};
