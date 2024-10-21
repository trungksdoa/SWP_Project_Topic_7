import { useQuery } from "@tanstack/react-query";
import { manageProductServiceH } from "../../services/admin/manageProductServiceH";

export const useGetTopSaleProduct = (startDate, endDate) => {
  const q = useQuery({
    queryKey: ["top-sale-product"],
    queryFn: () => manageProductServiceH.getTopSaleProduct(startDate, endDate),
  });

  return {
    ...q,
    data: q.data?.data,
  };
};