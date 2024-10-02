import { useMutation } from "@tanstack/react-query";
import { manageCatgegoryServiceAdmin } from "../../../services/admin/manageCategoryServiceAdmin";

export const useDeleteCategory = () => {
  return useMutation({
    mutationFn: (id) => manageCatgegoryServiceAdmin.delete(id),
  });
};
