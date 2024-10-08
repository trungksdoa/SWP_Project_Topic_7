import { useQuery } from "@tanstack/react-query";
import { manageWaterServices } from "../../services/koifish/manageWaterServices";

export const useGetWaterStandard = (id) => {
  const q = useQuery({
    queryKey: ["Get-Water-Standard"],
    queryFn: () => manageWaterServices.getWaterStandard(id),
  });
  return {
    ...q,
    data: q?.data?.data
  }
};
