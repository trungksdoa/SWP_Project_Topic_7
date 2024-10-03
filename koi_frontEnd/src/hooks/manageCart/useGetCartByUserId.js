import { useQuery } from "@tanstack/react-query";
import { manageCartService } from "../../services/manageCartServices";

export const useGetCartByUserId = (id) => {
  const q = useQuery({
    queryKey: ["get-cart"],
    queryFn: () => manageCartService.getCart(id),
  });
  return {
    ...q,
    data: q?.data?.data?.data,
  };
};
