import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useGetKoiByKoiId = (id) => {
  const q = useQuery({
    queryKey: ["Get-koi-by-koi-id"],
    queryFn: () => manageKoiFishServices.getKoiByKoiId(id),
  });
  return {
    ...q,
    data: q?.data?.data,
  };
};
