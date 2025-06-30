"use client";

import React from "react";
import { useLoading } from "@/hooks/use-loading";
import { LoadingOverlay } from "./loading";

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading, loadingText } = useLoading();

    return (
        <>
            {children}
            {isLoading && <LoadingOverlay text={loadingText} />}
        </>
    );
};
