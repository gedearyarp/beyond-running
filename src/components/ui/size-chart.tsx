"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export interface SizeChartData {
    size: string;
    chest: string;
    front: string;
    back: string;
}

interface SizeChartModalProps {
    isOpen: boolean;
    onClose: () => void;
    sizeData?: SizeChartData[];
    productName?: string;
    sizeGuideImages?: { url: string; altText: string }[];
}

// Default size data sebagai fallback
const defaultSizeData: SizeChartData[] = [
    { size: "X-Small", chest: "43", front: "59", back: "61" },
    { size: "Small", chest: "46", front: "61", back: "63" },
    { size: "Medium", chest: "48", front: "63", back: "65" },
    { size: "Large", chest: "50", front: "65", back: "67" },
    { size: "X-Large", chest: "53", front: "68", back: "70" },
];

export default function SizeChartModal({
    isOpen,
    onClose,
    sizeData = defaultSizeData,
    productName = "Product",
    sizeGuideImages,
}: SizeChartModalProps) {
    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <h2 className="text-xl md:text-2xl font-itc-demi text-gray-900">Size Chart</h2>
                        {productName && <p className="text-sm font-folio-medium text-gray-600 mt-1">{productName}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6">
                        {/* Instructions */}
                        <div className="mb-6 md:mb-8">
                            <h3 className="text-base md:text-lg font-folio-medium text-gray-900 mb-2">
                                How to Measure
                            </h3>
                            <p className="text-sm md:text-base font-folio-light text-gray-600">
                                Select your normal size. Measurements in centimeters (CM).
                            </p>
                        </div>

                        {/* Size Guide Images or Table */}
                        {sizeGuideImages && sizeGuideImages.length > 0 ? (
                            <div className="flex flex-col items-center gap-6 mb-8">
                                {sizeGuideImages.map((img, idx) => (
                                    <div key={img.url} className="w-full max-w-2xl">
                                        <img
                                            src={img.url}
                                            alt={img.altText || `Size Guide ${idx + 1}`}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden rounded-lg border border-gray-200 mx-4 md:mx-0">
                                        <table className="min-w-full">
                                            {/* Table Header */}
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-folio-medium text-gray-900 whitespace-nowrap">
                                                        Size
                                                    </th>
                                                    <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-folio-medium text-gray-900 whitespace-nowrap">
                                                        Chest
                                                    </th>
                                                    <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-folio-medium text-gray-900 whitespace-nowrap">
                                                        Front
                                                    </th>
                                                    <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-folio-medium text-gray-900 whitespace-nowrap">
                                                        Back
                                                    </th>
                                                </tr>
                                            </thead>

                                            {/* Table Body */}
                                            <tbody className="divide-y divide-gray-200">
                                                {sizeData.map((item, index) => (
                                                    <tr
                                                        key={item.size}
                                                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                            } hover:bg-gray-100 transition-colors`}
                                                    >
                                                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-folio-light text-gray-900 whitespace-nowrap">
                                                            {item.size}
                                                        </td>
                                                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-folio-light text-gray-700 text-center whitespace-nowrap">
                                                            {item.chest}
                                                        </td>
                                                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-folio-light text-gray-700 text-center whitespace-nowrap">
                                                            {item.front}
                                                        </td>
                                                        <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-folio-light text-gray-700 text-center whitespace-nowrap">
                                                            {item.back}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <p className="text-xs md:text-sm font-folio-light text-orange-800">
                                <strong>Tip:</strong> If you are between sizes, we recommend
                                choosing the larger size for a more comfortable fit.
                            </p>
                        </div>

                        {/* Measurement Guide - Mobile Friendly */}
                        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm md:text-base font-folio-medium text-blue-900 mb-2">
                                Measurement Guide:
                            </h4>
                            <ul className="text-xs md:text-sm font-folio-light text-blue-800 space-y-1">
                                <li>
                                    <strong>Chest:</strong> Measure around the fullest part of your
                                    chest
                                </li>
                                <li>
                                    <strong>Length:</strong> Measure from the highest point of the shoulder down to the bottom hem of the garment
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
