import { useQuery } from "@tanstack/react-query";
import { manageOrderServices } from "../../services/manageOderServices";

export const useGetTotalSales = (startDate, endDate) => {
  const q = useQuery({
    queryKey: ["total-sales"],
    queryFn: () => manageOrderServices.getTotalSales(startDate, endDate),
  });

  return {
    ...q,
    data: q.data?.data,
  };
};