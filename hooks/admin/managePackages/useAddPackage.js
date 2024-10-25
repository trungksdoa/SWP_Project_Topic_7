import { useMutation } from "@tanstack/react-query";
import { addPackage } from "../../../services/managePackageServiceH";

export const useAddPackage = () => {
  return useMutation({
    mutationFn: (packageData) => addPackage(packageData),
  });
};
