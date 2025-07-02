"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import BaseModal from "./base-modal";

export interface FilterSelections {
    size: string[];
    category: string[];
    gender: string[];
    type?: string[];
}

export interface FilterOption {
    value: string;
    label: string;
}

interface FilterModalProps {
    onClose: () => void;
    onApplyFilters: (filters: FilterSelections) => void;
    initialFilters: FilterSelections;
    sizeOptions: FilterOption[];
    categoryOptions: FilterOption[];
    genderOptions: FilterOption[];
    typeOptions?: FilterOption[];
    getSubcategoryOptionsForCategory?: (catValue: string) => FilterOption[];
}

export default function FilterModal({
    onClose,
    onApplyFilters,
    initialFilters,
    sizeOptions,
    categoryOptions,
    genderOptions,
    typeOptions,
    getSubcategoryOptionsForCategory,
}: FilterModalProps) {
    const [expandedSections, setExpandedSections] = useState({
        size: true,
        category: true,
        gender: false,
        type: true,
    });

    const [selectedFilters, setSelectedFilters] = useState<FilterSelections>(initialFilters);
    const [internalTypeOptions, setInternalTypeOptions] = useState<FilterOption[]>([]);

    useEffect(() => {
        setSelectedFilters(initialFilters);
    }, [initialFilters]);

    useEffect(() => {
        if (getSubcategoryOptionsForCategory && selectedFilters.category && selectedFilters.category[0]) {
            const found = categoryOptions.find(opt => opt.label === selectedFilters.category[0]);
            const catValue = found ? found.value : "";
            setInternalTypeOptions(getSubcategoryOptionsForCategory(catValue));
        } else {
            setInternalTypeOptions([]);
        }
    }, [selectedFilters.category, getSubcategoryOptionsForCategory, categoryOptions]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const setFilter = (section: keyof FilterSelections, value: string) => {
        setSelectedFilters((prev) => ({
            ...prev,
            [section]: [value],
        }));
    };

    const isFilterSelected = (section: keyof FilterSelections, value: string) => {
        return (selectedFilters[section] || [])[0] === value;
    };

    const handleReset = () => {
        const resetFilters = { size: [], category: [], gender: [], type: [] };
        setSelectedFilters(resetFilters);
        onApplyFilters(resetFilters);
        onClose();
    };

    const handleApply = () => {
        onApplyFilters(selectedFilters);
        onClose();
    };

    return (
        <BaseModal
            title="+ Filter"
            onClose={onClose}
            onReset={handleReset}
            onApply={handleApply}
            slideDirection="left"
        >
            {/* Size Section */}
            <div className="mb-8">
                <div
                    className="flex justify-between items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection("size")}
                >
                    <h3 className="text-2xl font-medium">Size</h3>
                    {expandedSections.size ? (
                        <Minus className="h-6 w-6" />
                    ) : (
                        <Plus className="h-6 w-6" />
                    )}
                </div>
                {expandedSections.size && (
                    <div className="space-y-4">
                        {sizeOptions.map((size) => (
                            <div
                                key={size.value}
                                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("size", size.label) ? "font-semibold" : ""}`}
                                onClick={() => setFilter("size", size.label)}
                            >
                                <div
                                    className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("size", size.label) ? "bg-black" : "bg-white"}`}
                                >
                                    {isFilterSelected("size", size.label) && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </div>
                                {size.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Category Section */}
            <div className="mb-8">
                <div
                    className="flex justify-between items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection("category")}
                >
                    <h3 className="text-2xl font-medium">Category</h3>
                    {expandedSections.category ? (
                        <Minus className="h-6 w-6" />
                    ) : (
                        <Plus className="h-6 w-6" />
                    )}
                </div>
                {expandedSections.category && (
                    <div className="space-y-4">
                        {categoryOptions.map((category) => (
                            <div
                                key={category.value}
                                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("category", category.label) ? "font-semibold" : ""}`}
                                onClick={() => setFilter("category", category.label)}
                            >
                                <div
                                    className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("category", category.label) ? "bg-black" : "bg-white"}`}
                                >
                                    {isFilterSelected("category", category.label) && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </div>
                                {category.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Type Section (Subcategory) */}
            {selectedFilters.category && selectedFilters.category[0] && (
                <div className="mb-8">
                    <div
                        className="flex justify-between items-center mb-4 cursor-pointer"
                        onClick={() => toggleSection("type")}
                    >
                        <h3 className="text-2xl font-medium">Type</h3>
                        {expandedSections.type ? (
                            <Minus className="h-6 w-6" />
                        ) : (
                            <Plus className="h-6 w-6" />
                        )}
                    </div>
                    {expandedSections.type && (
                        <div className="space-y-4">
                            {internalTypeOptions.length === 0 ? (
                                <div className="text-gray-400 text-base">No type available</div>
                            ) : (
                                internalTypeOptions.map((type) => (
                                    <div
                                        key={type.value}
                                        className={`text-xl cursor-pointer flex items-center ${isFilterSelected("type", type.label) ? "font-semibold" : ""}`}
                                        onClick={() => setFilter("type", type.label)}
                                    >
                                        <div
                                            className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("type", type.label) ? "bg-black" : "bg-white"}`}
                                        >
                                            {isFilterSelected("type", type.label) && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </div>
                                        {type.label}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Gender Section */}
            <div className="mb-8">
                <div
                    className="flex justify-between items-center mb-4 cursor-pointer"
                    onClick={() => toggleSection("gender")}
                >
                    <h3 className="text-2xl font-medium">Gender</h3>
                    {expandedSections.gender ? (
                        <Minus className="h-6 w-6" />
                    ) : (
                        <Plus className="h-6 w-6" />
                    )}
                </div>
                {expandedSections.gender && (
                    <div className="space-y-4">
                        {genderOptions.map((gender) => (
                            <div
                                key={gender.value}
                                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("gender", gender.label) ? "font-semibold" : ""}`}
                                onClick={() => setFilter("gender", gender.label)}
                            >
                                <div
                                    className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("gender", gender.label) ? "bg-black" : "bg-white"}`}
                                >
                                    {isFilterSelected("gender", gender.label) && (
                                        <span className="text-white text-xs">✓</span>
                                    )}
                                </div>
                                {gender.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </BaseModal>
    );
}
