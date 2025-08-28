import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import clientAxios from "@/lib/axios/clientAxios";

export default function useDeletePost(setShowConfirm: (show: boolean) => void) {
  const queryClient = useQueryClient();
    const t = useTranslations("post")

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: async (post_id: number) => {
      const response = await clientAxios.delete(`/posts/${post_id}`);
      return response.data;
    },

    onSuccess: () => {
      toast.success(t("post_deleted"));
     queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      setShowConfirm(false);
    },

    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      const message = err.response?.data?.message || "Something went wrong";

      toast.error(message);
    },
  });

  return { deletePost, isPending };
}
