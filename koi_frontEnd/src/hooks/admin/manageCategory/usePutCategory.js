import { useMutation } from "@tanstack/react-query";
import { manageCatgegoryServiceAdmin } from "../../../services/admin/manageCategoryServiceAdmin";

export const usePutCategory = () => {
  return useMutation({
    mutationFn: ({ id, payload }) =>
      manageCatgegoryServiceAdmin.editCategory(id, payload),
  });
};
