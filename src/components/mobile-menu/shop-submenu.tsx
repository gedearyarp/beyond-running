"use client";

import Link from "next/link";
import { useCollectionsStore } from "@/store/collections";
import { useEffect, useState, useContext } from "react";
import { getAllProductsForShopPage } from "@/lib/shopify";
import type { ProductCardType } from "@/lib/shopify/types";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Skeleton Loading Component
const CollectionSkeleton = () => (
    <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
            <div key={index}>
                <div
                    className={`rounded animate-shimmer ${index % 3 === 0 ? "w-full h-5" : index % 3 === 1 ? "w-4/5 h-4" : "w-3/4 h-4"
                        }`}
                    style={{
                        animationDelay: `${index * 200}ms`,
                    }}
                ></div>
            </div>
        ))}
    </div>
);

export default function ShopSubmenu({ onClose }: { onClose: () => void }) {
    const { collections, isLoading, error } = useCollectionsStore();
    const [allProducts, setAllProducts] = useState<ProductCardType[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        setLoadingProducts(true);
        getAllProductsForShopPage(100)
            .then((data) => setAllProducts(data))
            .finally(() => setLoadingProducts(false));
    }, []);

    // Helper: normalize
    const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "-");

    // Main categories (dinamis, urut: Top, Bottom, lalu lainnya, Accessories terpisah)
    const allMainCategories = Array.from(new Set(allProducts.map((p) => p.productType).filter(Boolean)));
    const mainCategories = (() => {
        const filtered = allMainCategories.filter(cat => cat && cat.toLowerCase() !== 'accessories');
        const topIdx = filtered.findIndex(cat => cat.toLowerCase() === 'top');
        const bottomIdx = filtered.findIndex(cat => cat.toLowerCase() === 'bottom');
        const top = topIdx !== -1 ? [filtered[topIdx]] : [];
        const bottom = bottomIdx !== -1 ? [filtered[bottomIdx]] : [];
        const rest = filtered.filter((cat, i) => i !== topIdx && i !== bottomIdx);
        return [...top, ...bottom, ...rest];
    })();
    const accessoriesCategory = allMainCategories.find(cat => cat && cat.toLowerCase() === 'accessories');

    // Helper: get subcategories for a main category
    function getSubcategoriesForCategory(category: string) {
        const set = new Set<string>();
        allProducts
            .filter((p) => p.productType && p.productType === category)
            .forEach((p) => (p.tags || []).forEach((tag) => set.add(tag)));
        return Array.from(set).sort();
    }

    // Helper: navigate and close after route change
    const handleNavigate = (href: string) => {
        router.push(href);
        // Wait for route change, then close
        setTimeout(() => { onClose(); }, 150); // 150ms delay for smoothness
    };

    function renderAccordionSection(label: string, gender: string, categories: string[], accessories?: boolean) {
        const isOpen = openSection === gender;
        return (
            <div className="mb-1">
                <button
                    className="w-full flex justify-between items-center font-folio-bold text-[17px] py-2 px-0 focus:outline-none bg-transparent"
                    onClick={() => setOpenSection(isOpen ? null : gender)}
                    aria-expanded={isOpen}
                >
                    <span>{label}</span>
                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                    <div className="pl-1 pt-1 pb-0 animate-fade-in">
                        {categories.map((cat) => (
                            <div key={cat} className="mb-1">
                                <div className="text-[15px] text-gray-700 font-folio-bold mb-0.5">{cat}</div>
                                <ul className="flex flex-wrap gap-1 mb-0.5">
                                    {getSubcategoriesForCategory(cat).map((tag) => (
                                        <li key={tag}>
                                            <button
                                                type="button"
                                                onClick={() => handleNavigate(`/shop?gender=${gender}&category=${normalize(cat)}&subcategory=${normalize(tag)}`)}
                                                className="inline-block bg-gray-50 rounded px-2 py-1 text-[13px] font-folio-medium text-gray-800 hover:bg-gray-200 transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    function renderCollectionsAccordion(collections: any[], isLoading: boolean, error: any) {
        const isOpen = openSection === 'collections';
        return (
            <div className="mb-1">
                <button
                    className="w-full flex justify-between items-center font-folio-bold text-[17px] py-2 px-0 focus:outline-none bg-transparent"
                    onClick={() => setOpenSection(isOpen ? null : 'collections')}
                    aria-expanded={isOpen}
                >
                    <span>Collections</span>
                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                    <div className="pl-1 pt-1 pb-0 animate-fade-in">
                        {isLoading ? (
                            <CollectionSkeleton />
                        ) : error ? (
                            <div className="text-red-500 animate-fade-in text-[15px]">Error loading collections</div>
                        ) : (
                            <ul className="space-y-0.5">
                                {collections.map((collection) => (
                                    <li key={collection.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleNavigate(`/shop/${collection.handle}`)}
                                            className="block w-full text-left cursor-pointer hover:bg-gray-100 rounded px-2 py-1 text-[15px] font-folio-bold text-gray-800 transition-colors"
                                        >
                                            {collection.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="px-4 py-6">
            <h2 className="text-xl font-folio-bold text-[#d17928] mb-6 animate-fade-in">Shop</h2>
            <div className="space-y-2">
                {renderAccordionSection('Men', 'men', mainCategories)}
                {renderAccordionSection('Women', 'women', mainCategories)}
                {accessoriesCategory && renderAccordionSection('Accessories', 'accessories', [accessoriesCategory], true)}
                {renderCollectionsAccordion(collections, isLoading, error)}
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={() => handleNavigate('/shop')}
                        className="block w-full text-center font-folio-bold text-[17px] rounded-full bg-black text-white py-3 transition-colors hover:bg-gray-800"
                    >
                        All Products
                    </button>
                </div>
            </div>
        </div>
    );
}
