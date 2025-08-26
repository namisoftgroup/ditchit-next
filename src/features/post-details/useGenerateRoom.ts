import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { generate } from "./service";
import { useRouter } from "next/navigation";
import { useChatStore } from "../chat/store";

export default function useGenerateRoom() {
  const router = useRouter();
  const { addRoom } = useChatStore();

  const { mutate: generateRoom, isPending } = useMutation({
    mutationFn: async (postId: number) => {
      const res = await generate(postId);
      return res;
    },

    onSuccess: (response) => {
      addRoom(response.room);
      router.push(`/chats/${response.room.id}`);
    },

    onError: () => {
      toast.error("some thing went wrong");
    },
  });

  return { generateRoom, isPending };
}
