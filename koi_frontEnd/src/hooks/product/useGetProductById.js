import { useQuery } from "@tanstack/react-query";
import { manageProductsServices } from "../../services/manageProducrsServices";

export const useGetProductByid = (id) => {
    const q = useQuery({
        queryKey: ['Get-Product'],
        queryFn: () => manageProductsServices.getProductById(id)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}