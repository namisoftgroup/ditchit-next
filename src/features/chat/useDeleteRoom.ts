import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRoomAction } from "./actions";
import { useParams, useRouter } from "next/navigation";

export default function useDeleteRoom(setShowConfirm: (show: boolean) => void) {
  const router = useRouter();
  const params = useParams();

  const { mutate: deleteRoom, isPending } = useMutation({
    mutationFn: deleteRoomAction,

    onSuccess: () => {
      toast.success("Chat deleted successfully");
      setShowConfirm(false);

      if (params.roomId) {
        router.push("/chats");
      } else {
        router.refresh();
      }
    },
  });

  return { deleteRoom, isPending };
}
