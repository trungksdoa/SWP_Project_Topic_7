import { manageProductsServices } from "../../../services/manageProducrsServices"
import { useQuery } from "@tanstack/react-query"

export const useGetAllProducts = () => {
    const q = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return manageProductsServices.getAllProducts()
        }
    })
    return {
        ...q,
        data: q.data?.data?.data?.content
    }
}