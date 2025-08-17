import { create } from "zustand";
import { Message, Room } from "./types";

interface ChatStore {
  rooms: Room[];
  messagesByRoom: Record<number, Message[]>;

  setRooms: (rooms: Room[]) => void;
  setMessages: (roomId: number, messages: Message[]) => void;
  addMessage: (roomId: number, message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  rooms: [],
  messagesByRoom: {},

  setRooms: (rooms) => set({ rooms }),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: [...messages].reverse(),
      },
    })),

  addMessage: (roomId, message) =>
    set((state) => ({
      messagesByRoom: {
        ...state.messagesByRoom,
        [roomId]: [...(state.messagesByRoom[roomId] || []), message],
      },
    })),
}));
