import { useMutation } from "@tanstack/react-query";
import { managePackageServiceH } from "../../../services/admin/managePackageServiceH";

export const useAddPackage = () => {
  return useMutation({
    mutationFn: (payload) => managePackageServiceH.addPackage(payload),
  });
};

