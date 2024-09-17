import { useQuery } from "@tanstack/react-query";
import { manageProductsServices } from "../../services/manageProducrsServices";
import { sleep } from "../../utils/sleep";
export const useGetProductById = (id) => {
  const q = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      await sleep(2000);
      return await manageProductsServices.getProductById(id);
    },
  });
  return {
    ...q,
    data: q?.data?.data?.data,
  };
};
