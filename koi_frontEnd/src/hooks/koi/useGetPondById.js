import { useQuery } from "@tanstack/react-query";
import { managePondServices } from "../../services/koifish/managePondServices";


export const useGetPondById = (pondId) => {
  const q = useQuery({
    queryKey: ["pond", pondId],
    queryFn: async () => {
      const response = await managePondServices.getPondById(pondId);
      return response.data;
    },
    enabled: !!pondId, // Chỉ gọi API khi có pondId
  });

  return {
    ...q,
    data: q?.data?.data,
  };
};