import { useMutation, useQueryClient } from "@tanstack/react-query";
import { manageKoiFishServices } from '../../services/koifish/manageKoiFishServices';

export const useAddGrowth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      return manageKoiFishServices.addGrowth(id, payload);
    },
    onError: (error) => {
      console.error('Error in useAddGrowth:', error);
    },
    onSuccess: () => {
      // Optionally invalidate and refetch
      queryClient.invalidateQueries(['growthHistory']);
    }
  });
};
