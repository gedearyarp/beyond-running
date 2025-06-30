"use client";

import { useState } from "react";
import BaseModal from "./base-modal";

interface SortModalProps {
    onClose: () => void;
    onApplySort: (sort: string) => void;
    initialSort: string;
}

export default function CommunitySortModal({ onClose, onApplySort, initialSort }: SortModalProps) {
    const [selectedSort, setSelectedSort] = useState<string>(initialSort);

    const sortOptions = ["Featured", "Upcoming Events", "Past Events"];

    const handleReset = () => {
        const resetSort = "Featured";
        setSelectedSort(resetSort);
        onApplySort(resetSort);
        onClose();
    };

    const handleApply = () => {
        onApplySort(selectedSort);
        onClose();
    };

    return (
        <BaseModal
            title="+ Filter"
            onClose={onClose}
            onReset={handleReset}
            onApply={handleApply}
            slideDirection="right"
        >
            <div className="mb-8">
                <h3 className="text-2xl font-medium font-avant-garde mb-4">Sort By:</h3>
                <div className="space-y-4">
                    {sortOptions.map((option) => (
                        <div
                            key={option}
                            className={`text-xl cursor-pointer font-avant-garde ${selectedSort === option ? "font-semibold" : ""}`}
                            onClick={() => setSelectedSort(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
}
