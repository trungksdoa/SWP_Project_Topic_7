import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from '../../services/koifish/manageKoiFishServices';
import { sleep } from "../../utils/sleep";

export const useGetGrowth = (koiId) => {
  const q = useQuery({
    queryKey: ['growth', koiId],
    queryFn: async () => {
      await sleep(1000);
      const result = await manageKoiFishServices.getGrowth(koiId);
      console.log("Growth data fetched:", result.data);
      return result.data;
    },
    enabled: !!koiId, // Enable when koiId is available
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
  });
  
  return {
    ...q,
    data: q.data,
  };
};
