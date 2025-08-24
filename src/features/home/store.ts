import { create } from "zustand";

type FilterState = {
  longitude: string;
  latitude: string;
  zip_code: number;
  address: string;
  delivery_method: string;
  kilometers: number;
};

type HomeFilterStore = {
  filter: FilterState;
  setFilter: (newFilter: Partial<FilterState>) => void;
};

export const useHomeFilter = create<HomeFilterStore>()((set) => ({
  filter: {
    latitude: "39.8283",
    longitude: "-98.5795",
    zip_code: 20500,
    address: "United States",
    delivery_method: "both",
    kilometers: 50,
  },

  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
}));
