import { useQuery } from "@tanstack/react-query";
import { manageWaterServices } from "../../services/koifish/manageWaterServices";

export const useGetWaterParameters = (pondId) => {
  const q = useQuery({
    queryKey: ["Get-parameter"],
    queryFn: () => manageWaterServices.getWaterByPondId(pondId),
  });
  return {
    ...q,
    data: q?.data?.data?.data?.data,
  };
};
