import { create } from "zustand";
import { Message } from "./types";

interface ChatStore {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  setMessages: (messages: Message[]) =>
    set({ messages: [...messages].reverse() }),

  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
