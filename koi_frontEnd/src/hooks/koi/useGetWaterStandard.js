import { useQuery } from "@tanstack/react-query";
import { manageWaterServices } from "../../services/koifish/manageWaterServices";

export const useGetWaterStandard = (id,options = {}) => {
  const q = useQuery({
    queryKey: ["Get-Water-Standard"],
    queryFn: () => manageWaterServices.getWaterStandard(id),
    enabled: !!id,
    ...options
  });
  return {
    ...q,
    data: q?.data?.data?.data
  }
};
