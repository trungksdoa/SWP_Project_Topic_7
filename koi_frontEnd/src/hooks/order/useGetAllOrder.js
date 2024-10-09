import { useQuery } from "@tanstack/react-query";
import { manageOrderServices } from "../../services/manageOderServices";

export const useGetAllOrder = () => {
  const q = useQuery({
    queryKey: ["Get-all-order"],
    queryFn: () => manageOrderServices.getAllOrder(),
  });
  return {
    ...q,
    data: q?.data?.data?.data,
  };
};
