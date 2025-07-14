import clientAxios from "@/lib/axios/clientAxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useGetMyFavorites from "./queries/useGetFavorites";

export default function useStoreFavorites() {
  const { refetch } = useGetMyFavorites();

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
      refetch();
    },

    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Something went wrong";

      toast.error(message);
    },
  });

  return { storeFavorites, isPending };
}
