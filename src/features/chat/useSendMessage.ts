import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "./service";
import { MessagePayload, SocketMessage, Message } from "./types";
import { toast } from "sonner";
import { useChatStore } from "./store";
import {
  sendFirstMessageSocket,
  sendMessageSocket,
} from "@/lib/socket/actions";

export default function useSendMessage(
  setMessage: (message: MessagePayload) => void
) {
  const { mutate: sendMessageMutation, isPending } = useMutation({
    mutationFn: async (payload: MessagePayload) => {
      const res = await sendMessage(payload);
      return res.data.data;
    },

    onSuccess(data) {
      const { messagesByRoom } = useChatStore.getState();
      const existingMessages = messagesByRoom[data.room.id] || [];

      const html = data.messages
        .map(
          (m: Message) => `<div class="recieved-message message">
            <div class="d-flex flex-column">
                <div class="message-content">
                    <p>${m.message ?? ""}</p>
                </div>
                <span class="time align-self-end">${m.time}</span>
            </div>
        </div>`
        )
        .join("");

      const socketMessage: SocketMessage = {
        user_id: data.room.post.user_id,
        room: data.room,
        messages: data.messages,
        html,
      };

      if (existingMessages.length === 0) {
        sendFirstMessageSocket(socketMessage);
      } else {
        sendMessageSocket(socketMessage);
      }

      setMessage({
        type: "text",
        message: "",
        room_id: data.room.id,
        latitude: undefined,
        longitude: undefined,
        files: undefined,
      });
    },

    onError: (err) => {
      console.error(err);
      toast.error("Server error during sending message");
    },
  });

  return { sendMessageMutation, isPending };
}
