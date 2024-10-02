import { useQuery } from "@tanstack/react-query"
import { manageCategoryServices } from '../../../services/admin/manageCategoryServiceH'

export const useGetCategory = () => {
    const q = useQuery({
        queryKey: ["Get-Category"],
        queryFn: () => manageCategoryServices.getCategory()
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}