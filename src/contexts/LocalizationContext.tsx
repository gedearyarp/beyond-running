"use client";

import React, { createContext, useContext, ReactNode } from "react";

export interface LocalizationData {
    countryCode: string;
    currencyCode: string;
    locale: string;
}

const LocalizationContext = createContext<LocalizationData | undefined>(undefined);

interface LocalizationProviderProps {
    children: ReactNode;
    data: LocalizationData;
}

export function LocalizationProvider({ children, data }: LocalizationProviderProps) {
    return <LocalizationContext.Provider value={data}>{children}</LocalizationContext.Provider>;
}

export function useLocalization(): LocalizationData {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error("useLocalization must be used within a LocalizationProvider");
    }
    return context;
}

