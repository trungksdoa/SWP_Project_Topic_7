import { useQuery } from "@tanstack/react-query"
import { manageImagesServices } from "../../../services/manageImagesServices"
export const useGetImagesProduct = (payload) => {
    const q = useQuery({
        queryKey: ["imagesProduct"],
        queryFn: () => {
            return manageImagesServices.getImageProduct(payload)
        }
    })
    return {
        ...q,
        data: q.data?.data
    }
}