import { useQuery } from "@tanstack/react-query"
import { managePackageServiceH } from "../../../services/admin/managePackageServiceH"

export const useGetPackage = () => {
    const q = useQuery({
        queryKey: ["Get-Package"],
        queryFn: () => managePackageServiceH.getPackage()
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}