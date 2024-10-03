import { useMutation } from "@tanstack/react-query";
import { manageBlogsServicesH } from "../../services/shop/manageBlogServicesH";

export const usePutBlog = () => {
  return useMutation({
    mutationFn: ({ id, payload }) => manageBlogsServicesH.putBlog(id, payload),
  });
};
