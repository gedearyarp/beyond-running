import { create } from "zustand";
import { Collection } from "@/lib/shopify/types";
import { getAllCollections } from "@/lib/shopify";

interface CollectionsState {
    collections: Collection[];
    isLoading: boolean;
    error: string | null;
    fetchCollections: (countryCode?: string) => Promise<Collection[]>;
    refreshCollections: (countryCode?: string) => Promise<void>;
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
    collections: [],
    isLoading: false,
    error: null,
    fetchCollections: async (countryCode: string = "ID") => {
        try {
            set({ isLoading: true, error: null });
            const collections = await getAllCollections(countryCode);
            set({ collections, isLoading: false });
            return collections;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to fetch collections";
            set({
                error: errorMessage,
                isLoading: false,
            });
            console.error("Error fetching collections:", errorMessage);
            return [];
        }
    },
    refreshCollections: async (countryCode: string = "ID") => {
        try {
            set({ isLoading: true, error: null });
            const collections = await getAllCollections(countryCode);
            set({ collections, isLoading: false });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Failed to fetch collections";
            set({
                error: errorMessage,
                isLoading: false,
            });
            console.error("Error refreshing collections:", errorMessage);
        }
    },
}));
