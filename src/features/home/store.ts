import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FilterState = {
  longitude: string;
  latitude: string;
  delivery_method: string;
  kilometers: number;
};

type HomeFilterStore = {
  filter: FilterState;
  setFilter: (newFilter: Partial<FilterState>) => void;
};

export const useHomeFilter = create<HomeFilterStore>()(
  persist(
    (set) => ({
      filter: {
        longitude: "",
        latitude: "",
        delivery_method: "",
        kilometers: 50,
      },

      setFilter: (newFilter) =>
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        })),
    }),
    {
      name: "home-filter-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
