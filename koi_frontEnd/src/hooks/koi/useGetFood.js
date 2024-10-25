import { useQuery } from '@tanstack/react-query';
import { manageWaterServices } from '../../services/koifish/manageWaterServices';

export const useGetFood = (pondId) => {
  return useQuery({
    queryKey: ['foodStandard', pondId],
    queryFn: () => manageWaterServices.getFoodStandard(pondId),
    select: (response) => response.data.data,
    enabled: !!pondId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
