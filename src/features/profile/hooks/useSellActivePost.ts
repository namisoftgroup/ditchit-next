import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import clientAxios from "@/lib/axios/clientAxios";
import useGetMyPosts from "./useGetMyPosts";

export default function useSellActivePost(setShowConfirm: (show: boolean) => void) {
  const { refetch } = useGetMyPosts();

  const { mutate: sellActivePost, isPending } = useMutation({
    mutationFn: async (post_id: number) => {
      const response = await clientAxios.post(`/posts/sale/${post_id}`);
      return response.data;
    },

    onSuccess: () => {
      toast.success("Post sold successfully");
      setShowConfirm(false);
      refetch();
    },

    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });

  return { sellActivePost, isPending };
}
