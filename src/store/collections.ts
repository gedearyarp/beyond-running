import { create } from 'zustand';
import { Collection } from '@/lib/shopify/types';
import { getAllCollections } from '@/lib/shopify';

interface CollectionsState {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  fetchCollections: () => Promise<Collection[]>;
  refreshCollections: () => Promise<void>;
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: [],
  isLoading: false,
  error: null,
  fetchCollections: async () => {
    try {
      set({ isLoading: true, error: null });
      const collections = await getAllCollections();
      set({ collections, isLoading: false });
      return collections;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch collections';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      console.error('Error fetching collections:', errorMessage);
      return [];
    }
  },
  refreshCollections: async () => {
    try {
      set({ isLoading: true, error: null });
      const collections = await getAllCollections();
      set({ collections, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch collections';
      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      console.error('Error refreshing collections:', errorMessage);
    }
  }
})); 