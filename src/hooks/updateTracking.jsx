import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const useUpdateTracking = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const updateTracking = useMutation({
    mutationFn: async ({ trackingId, status, location, notes }) => {
      const response = await axiosSecure.post("/api/track/update", {
        trackingId,
        status,
        location,
        notes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch tracking queries to update the UI
      queryClient.invalidateQueries({ queryKey: ["track"] });
      console.log("Tracking updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating tracking:", error);
      throw error;
    },
  });

  return {
    updateTracking: updateTracking.mutate,
    updateTrackingAsync: updateTracking.mutateAsync,
    isUpdating: updateTracking.isPending,
    error: updateTracking.error,
    isSuccess: updateTracking.isSuccess,
  };
};

export default useUpdateTracking;
