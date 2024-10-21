import { useQuery } from "@tanstack/react-query";
import { manageOrderServices } from "../../services/manageOderServices";

export const useGetOrderStatusChart = (startDate, endDate) => {
  const q = useQuery({
    queryKey: ["order-status-chart"],
    queryFn: () => manageOrderServices.getOrderStatusChart(startDate, endDate),
  });

  return {
    ...q,
    data: q.data?.data,
  };
};