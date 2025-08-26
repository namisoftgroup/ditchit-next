import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, Room } from "./types";

interface ChatStore {
  rooms: Room[];
  messagesByRoom: Record<number, Message[]>;

  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: number, room: Partial<Room>) => void;
  removeRoom: (roomId: number) => void;

  setMessages: (roomId: number, messages: Message[]) => void;
  addMessage: (roomId: number, message: Message) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      rooms: [],
      messagesByRoom: {},

      setRooms: (rooms) => set({ rooms }),
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),

      updateRoom: (roomId: number, updatedRoom: Partial<Room>) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, ...updatedRoom } : room
          ),
        })),

      removeRoom: (roomId: number) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== roomId),
          messagesByRoom: Object.fromEntries(
            Object.entries(state.messagesByRoom).filter(
              ([key]) => Number(key) !== roomId
            )
          ),
        })),

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
            [roomId]: [
              ...(state.messagesByRoom[roomId] || []).filter(
                (m) => m.timestamp !== message.timestamp
              ),
              message,
            ],
          },
        })),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        rooms: state.rooms,
        messagesByRoom: state.messagesByRoom,
      }),
    }
  )
);
