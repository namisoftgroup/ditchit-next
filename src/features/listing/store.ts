import { create } from "zustand";

export type FilterState = {
  latitude: string;
  longitude: string;
  zip_code: string;
  address: string;
  delivery_method: string;
  kilometers: number;
};

type HomeFilterStore = {
  filter: FilterState;
  setFilter: (newFilter: Partial<FilterState>) => void;
};

const DEFAULT_FILTER: FilterState = {
  latitude: "39.8283",
  longitude: "-98.5795",
  zip_code: "20500",
  address: "United States",
  delivery_method: "both",
  kilometers: 50,
};

export const useHomeFilter = create<HomeFilterStore>((set) => ({
  filter: DEFAULT_FILTER,
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
}));
