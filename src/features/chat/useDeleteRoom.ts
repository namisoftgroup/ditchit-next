import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteRoomAction } from "./actions";

export default function useDeleteRoom(setShowConfirm: (show: boolean) => void) {
  const { mutate: deleteRoom, isPending } = useMutation({
    mutationFn: ({ roomId }: { roomId: number }) => deleteRoomAction(roomId),

    onSuccess: () => {
      toast.success("Chat deleted successfully");
      setShowConfirm(false);
    },
  });

  return { deleteRoom, isPending };
}
