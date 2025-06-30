"use client";

import React from "react";
import { create } from "zustand";

interface LoadingState {
    isLoading: boolean;
    loadingText: string;
    setLoading: (loading: boolean, text?: string) => void;
    showLoading: (text?: string) => void;
    hideLoading: () => void;
}

export const useLoading = create<LoadingState>((set) => ({
    isLoading: false,
    loadingText: "Loading...",
    setLoading: (loading: boolean, text = "Loading...") =>
        set({ isLoading: loading, loadingText: text }),
    showLoading: (text = "Loading...") => set({ isLoading: true, loadingText: text }),
    hideLoading: () => set({ isLoading: false }),
}));

// Hook untuk loading state lokal
export const useLocalLoading = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [loadingText, setLoadingText] = React.useState("Loading...");

    const showLoading = (text?: string) => {
        setLoadingText(text || "Loading...");
        setIsLoading(true);
    };

    const hideLoading = () => {
        setIsLoading(false);
    };

    const setLoading = (loading: boolean, text?: string) => {
        if (text) setLoadingText(text);
        setIsLoading(loading);
    };

    return {
        isLoading,
        loadingText,
        showLoading,
        hideLoading,
        setLoading,
    };
};
