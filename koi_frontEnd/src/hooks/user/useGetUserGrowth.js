import { useQuery } from "@tanstack/react-query";
import { ManageUserAll } from "../../services/admin/ManageUserAll";

export const useGetUserGrowth = (startDate, endDate) => {
  const q = useQuery({
    queryKey: ["user-growth"],
    queryFn: () => ManageUserAll.getUserGrowth(startDate, endDate),
  });

  return {
    ...q,
    data: q.data?.data,
  };
};