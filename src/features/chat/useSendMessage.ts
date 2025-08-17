import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "./service";
import { useChatStore } from "./store";
import { Message, MessagePayload } from "./types";
import { toast } from "sonner";

export default function useSendMessage() {
  const { addMessage } = useChatStore();

  const { mutate: sendMessageMutation, isPending } = useMutation({
    mutationFn: async (payload: MessagePayload) => {
      const res = await sendMessage(payload);
      return res.data.data;
    },

    onSuccess: (resposnse) => {
      const message = resposnse.messages[0];

      if (message?.sender_id) {
        addMessage(message as Message);
      }
    },

    onError: (err) => {
      console.log(err);
      toast.error("Server error during sending message");
    },
  });

  return { sendMessageMutation, isPending };
}
