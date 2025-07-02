"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BaseModalProps {
    title: string;
    onClose: () => void;
    children: ReactNode;
    onReset?: () => void;
    onApply?: () => void;
    applyButtonText?: string;
    slideDirection?: "left" | "right";
}

export default function BaseModal({
    title,
    onClose,
    children,
    onReset,
    onApply,
    applyButtonText = "APPLY FILTERS",
    slideDirection = "left",
}: BaseModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        // Wait for exit animation to complete before calling onClose
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleReset = () => {
        if (onReset) {
            setIsClosing(true);
            setTimeout(() => {
                onReset();
            }, 300);
        }
    };

    const handleApply = () => {
        if (onApply) {
            setIsClosing(true);
            setTimeout(() => {
                onApply();
            }, 300);
        }
    };

    const slideInClass = slideDirection === "left" ? "translate-x-0" : "translate-x-0";

    const slideOutClass = slideDirection === "left" ? "-translate-x-full" : "translate-x-full";

    return (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-hidden">
            <div
                className={`absolute inset-0 bg-white transition-transform duration-300 ease-out ${isVisible && !isClosing
                    ? slideInClass
                    : isClosing
                        ? slideOutClass
                        : slideDirection === "left"
                            ? "-translate-x-full"
                            : "translate-x-full"
                    }`}
                style={{
                    msOverflowStyle: 'none',
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 pb-4 flex-shrink-0">
                        <h2 className="text-xl font-medium">{title}</h2>
                        <div className="flex items-center">
                            <span className="mr-2 text-xl">Close</span>
                            <button
                                title="close-button"
                                onClick={handleClose}
                                className="bg-[#d17928] p-2 flex items-center justify-center cursor-pointer hover:bg-[#b86a1f] transition-colors duration-200"
                            >
                                <X className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 hide-scrollbar" style={{
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}>{children}</div>

                    {/* Footer Buttons */}
                    <div className="grid grid-cols-2 gap-4 p-6 pt-4 flex-shrink-0">
                        <button
                            onClick={handleReset}
                            className="py-4 bg-[#adadad] text-black font-medium cursor-pointer hover:bg-[#9a9a9a] transition-colors duration-200"
                        >
                            RESET ALL
                        </button>
                        <button
                            onClick={handleApply}
                            className="py-4 bg-black text-white font-medium cursor-pointer hover:bg-gray-800 transition-colors duration-200"
                        >
                            {applyButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
