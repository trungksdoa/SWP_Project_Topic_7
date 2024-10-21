import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from '../../services/koifish/manageKoiFishServices';
import { sleep } from "../../utils/sleep";

export const useGetGrowth = (koiId) => {
  const q = useQuery({
    queryKey: ['growthHistory', koiId],
    queryFn: async () => {
      await sleep(1000);
      const result = await manageKoiFishServices.getGrowth(koiId);
      console.log("Growth data fetched:", result.data);
      return result.data;
    },
    enabled: false, // Don't fetch automatically
    staleTime: Infinity, // Prevent automatic refetches
    cacheTime: Infinity, // Keep the data cached indefinitely
  });
  
  return {
    ...q,
    data: q.data,
  };
};
