import { useQuery } from "@tanstack/react-query";
import { manageWaterServices } from "../../services/koifish/manageWaterServices";

export const useGetWaterParameters = (pondId, options = {}) => {
  const q = useQuery({
    queryKey: ["Get-parameter", pondId],
    queryFn: () => {
      return manageWaterServices.getWaterByPondId(pondId);
    },
    enabled: !!pondId,
    ...options,
  });

  return {
    ...q,
    data: q?.data?.data?.data,
  };
};
