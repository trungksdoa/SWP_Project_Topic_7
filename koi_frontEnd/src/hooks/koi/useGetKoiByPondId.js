import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useGetKoiByPondId = (pondId) => {
  const q = useQuery({
    queryKey: ["koiByPondId", pondId],
    queryFn: () => {
      return manageKoiFishServices.getKoiByPondId(pondId);
    },
    enabled: !!pondId,
  });

  return {
    ...q,
    data: q?.data?.data?.data,
  };
};
