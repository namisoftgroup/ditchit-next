import clientAxios from "@/lib/axios/clientAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useStoreFavorites() {
  const queryClient = useQueryClient();

  const { mutate: storeFavorites, isPending } = useMutation({
    mutationFn: async (post_id: number) => {
      const response = await clientAxios.post(
        "/profile/storeAndRemoveFavorite",
        {
          post_id,
        }
      );
      return response.data;
    },

    onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
    },

    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Something went wrong";

      toast.error(message);
    },
  });

  return { storeFavorites, isPending };
}
