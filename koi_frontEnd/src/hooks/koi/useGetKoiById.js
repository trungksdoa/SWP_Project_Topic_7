import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useGetKoiById = (id) => {
  const q = useQuery({
    queryKey: ["Get-koi-by-id"],
    queryFn: () => manageKoiFishServices.getKoiByUserId(id),
  });
  return {
    ...q,
    data: q?.data?.data,
  };
};
