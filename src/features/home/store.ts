import { create } from "zustand";

type FilterState = {
  user_id: string;
  longitude: string;
  latitude: string;
  delivery_method: string;
  kilometers: number;
};

type HomeFilterStore = {
  filter: FilterState;
  setFilter: (newFilter: Partial<FilterState>) => void;
};

export const useHomeFilter = create<HomeFilterStore>((set) => ({
  filter: {
    user_id: "",
    longitude: "",
    latitude: "",
    delivery_method: "",
    kilometers: 0,
  },

  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
}));
