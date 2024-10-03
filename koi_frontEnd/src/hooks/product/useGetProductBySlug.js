import { useQuery } from "@tanstack/react-query"
import { manageProductsServices } from "../../services/manageProducrsServices"

export const useGetProductBySlug = (slug) => {
    const q = useQuery({
        queryKey: ["Get-Product-Slug"],
        queryFn: () => manageProductsServices.getProductBySlug(slug)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}