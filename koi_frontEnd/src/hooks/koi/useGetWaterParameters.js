import { useQuery } from '@tanstack/react-query';
import { manageWaterServices } from '../../services/koifish/manageWaterServices';

export const useGetWaterParameters = (pondId) => {
    return useQuery({
        queryKey: ["waterParameters", pondId],
        queryFn: () => manageWaterServices.getWaterByPondId(pondId),
        enabled: !!pondId,
    });
}