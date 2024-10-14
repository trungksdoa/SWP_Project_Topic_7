import { useQuery } from "@tanstack/react-query"
import { managePaymentStatusServices } from "../../../services/admin/managePaymentStatusServices"

export const useGetPaymentStatus = () => {
    const q = useQuery({
        queryKey: ['Get-status'],
        queryFn: () => managePaymentStatusServices.getAllStatus()
    })
    return {
        ...q,
        data: q?.data?.data?.data
    }
}