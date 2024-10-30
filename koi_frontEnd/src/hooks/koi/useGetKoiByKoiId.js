import { useQuery } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";
import { sleep } from "../../utils/sleep";
export const useGetKoiByKoiId = (id) => {

  
  const q = useQuery({
    queryKey: ["koi", id], // Thêm id vào query ke
    queryFn: async () =>{
      await sleep(2000)
      return await manageKoiFishServices.getKoiByKoiId(id)
    },
  });
 
  return {
    ...q,
    data: q?.data?.data,
  };
};
