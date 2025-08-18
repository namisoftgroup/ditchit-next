import { create } from "zustand";
import { Message, Room } from "./types";

interface ChatStore {
  rooms: Room[];
  messagesByRoom: Record<number, Message[]>;

  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;

  setMessages: (roomId: number, messages: Message[]) => void;
  addMessage: (roomId: number, message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  rooms: [],
  messagesByRoom: {},

  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),

  updateRoom: (updatedRoom: Room) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
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
}));
