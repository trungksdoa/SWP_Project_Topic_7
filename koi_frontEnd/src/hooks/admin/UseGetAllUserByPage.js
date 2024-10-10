import { useQuery } from "@tanstack/react-query";
import { ManageUserAll } from "../../services/admin/ManageUserAll";
export const useGetAllUserByPage = (page, size) => {
  const q = useQuery({
    queryKey: ["user-all-page", page, size],
    queryFn: () => ManageUserAll.getAllUserPage(page, size),
  });

  console.log("q.data?.data?.data:", q.data?.data);
  const processedData = q.data?.data;

  return {
    ...q,
    data: processedData,
  };
};
