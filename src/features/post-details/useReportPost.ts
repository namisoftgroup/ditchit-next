import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportPost } from "./service";
import { useTranslations } from "next-intl";

export default function useReportPost(setShow: (show: boolean) => void) {
  const t = useTranslations();

  const { mutate: reportPostMutation, isPending } = useMutation({
    mutationFn: async ({
      postId,
      reason,
    }: {
      postId: number;
      reason: string;
    }) => {
      const res = await reportPost({ postId, reason });
      return res;
    },

    onSuccess: (response) => {
      console.log(response);

      toast.success(t("report_saved"));
      setShow(false);
    },

    onError: () => {
      toast.error(t("something_went_wrong"));
    },
  });

  return { reportPostMutation, isPending };
}
