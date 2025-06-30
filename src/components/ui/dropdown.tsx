"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    isSort?: boolean;
}

export default function CustomDropdown({
    isSort,
    options,
    value,
    onChange,
    placeholder,
}: CustomDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Get the selected option label
    const selectedOption = options.find((option) => option.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                className="flex items-center justify-center text-sm font-avant-garde cursor-pointer relative pr-6"
                onClick={() => setIsOpen(!isOpen)}
            >
                {!isSort && <Plus className="mr-2 h-3 w-3" />} {selectedOption ? selectedOption.label : placeholder}
                {/* Icon X untuk clear filter */}
                {!isSort && value && value !== "all" && value !== "All Stories" && value !== "All Categories" && (
                    <span
                        className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-200 transition-colors group"
                        onClick={e => {
                            e.stopPropagation();
                            onChange("");
                        }}
                        title="Clear filter"
                    >
                        <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l8 8m0-8l-8 8" />
                        </svg>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white shadow-md rounded-none border border-gray-100">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-avant-garde cursor-pointer"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
