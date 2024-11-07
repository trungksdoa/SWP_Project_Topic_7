import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useGetGrowth = (koiId) => {
  const q = useQuery({
    queryKey: ["growthHistory", koiId],
    queryFn: () => {
      return manageKoiFishServices.getGrowth(koiId);
    },
  });

  return {
    ...q,
    data: q.data?.data?.data,
  };
};
