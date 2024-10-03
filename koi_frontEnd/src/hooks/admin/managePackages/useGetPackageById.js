import { useQuery } from "@tanstack/react-query"
import { managePackageServiceH } from "../../../services/admin/managePackageServiceH"

export const useGetPackageById = (id) => {
    const q = useQuery({
        queryKey: ['Get-Package-by-id'],
        queryFn: () => managePackageServiceH.getPackageById(id)
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}