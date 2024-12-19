import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWardrobe = create(
  persist(
    (set) => ({
      wardrobe: [],
      addItem: (item) => {
        set((state) => ({
          wardrobe: [...state.wardrobe, item],
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          wardrobe: state.wardrobe.filter((i) => i.id !== id),
        }));
      },
      setInitialItems: (items) => {
        set((state) => ({
          wardrobe: items,
        }));
      },
    }),
    {
      name: "wardrobe-storage",
      storage: typeof window !== "undefined" ? localStorage : null,
    }
  )
);
