import { useMutation } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useAddKoi = () => {
  return useMutation({
    mutationFn: (formData) => {
      return manageKoiFishServices.addKoi(formData);
    },
    onError: (error) => {
      console.error('Error in useAddKoi:', error);
    }
  });
};
