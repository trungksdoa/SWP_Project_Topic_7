import { useMutation } from "@tanstack/react-query";
import { manageKoiFishServices } from "../../services/koifish/manageKoiFishServices";

export const useAddKoi = () => {
  return useMutation({
    mutationFn: (formData) => {
      console.log("FormData in useAddKoi:", formData); // Add this line for debugging
      return manageKoiFishServices.addKoi(formData);
    },
    onError: (error) => {
      console.error('Error in useAddKoi:', error);
    }
  });
};
