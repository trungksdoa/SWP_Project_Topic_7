import { useQuery } from "@tanstack/react-query";
import { manageOrderServices } from "../../services/manageOderServices";

export const useGetReceipt = (id) => {
  const q = useQuery({
    queryKey: ["Get-Order-Receipt"],
    queryFn: () => manageOrderServices.getReceiptOrder(id),
  });
  return {
    ...q,
    data: q?.data?.data?.data
  }
};
