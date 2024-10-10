import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

export const useAddKoi = () => {
  return useMutation({
    mutationFn: async (newKoi) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/fish`,
          newKoi,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error in useAddKoi:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
        throw error;
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error(`Error adding koi: ${error.message}`);
    },
    onSuccess: () => {
      toast.success("Koi added successfully");
    },
  });
};
