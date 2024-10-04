import { useMutation } from "@tanstack/react-query";
import { manageBlogsServicesH } from "../../services/shop/manageBlogServicesH";

export const useDeleeteBlogById = () => {
  return useMutation({
    mutationFn: (id) => manageBlogsServicesH.deleteBlogById(id),
  });
};
