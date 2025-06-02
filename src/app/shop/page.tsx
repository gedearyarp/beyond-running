"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/ui/ProductCard";
import CustomDropdown from "@/components/ui/dropdown";
import useMobile from "@/hooks/use-mobile";
import MobileHeader from "@/components/mobile-header";
import MobileMenu from "@/components/mobile-menu";
import FilterModal, { type FilterSelections } from "@/components/shop/filter-modal";
import SortModal from "@/components/shop/sort-modal";
import { ProductCardType } from "@/lib/shopify/types";

const sizeOptions = [
  { value: "size-1", label: "Size 1" },
  { value: "size-2", label: "Size 2" },
  { value: "size-3", label: "Size 3" },
  { value: "one-size", label: "One Size Fit All" },
];

const categoryOptions = [
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "running-tops", label: "Running Tops" },
  { value: "running-bottoms", label: "Running Bottoms" },
  { value: "outerwear", label: "Outerwear" },
  { value: "postrun", label: "Postrun" },
  { value: "accessories", label: "Accessories" },
];

const genderOptions = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-low", label: "Price, Low to High" },
  { value: "price-high", label: "Price, High to Low" },
];

interface ShopPageClientProps {
  initialProducts: ProductCardType[];
}

export default function ShopPageClient({ initialProducts }: ShopPageClientProps) {
  const [products, setProducts] = useState<ProductCardType[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<FilterSelections>({
    size: [],
    category: [],
    gender: [],
  });

  const [appliedSort, setAppliedSort] = useState<string>("Featured");

  useEffect(() => {
    const applyClientSideFiltersAndSort = () => {
      setLoading(true);
      setError(null);
      try {
        let filteredProducts = [...initialProducts];

        if (appliedFilters.category.length > 0) {
          filteredProducts = filteredProducts.filter(product =>
            appliedFilters.category.some(filterCat => product.productType?.toLowerCase() === filterCat.toLowerCase())
          );
        }

        const sortedProducts = [...filteredProducts];
        switch (appliedSort) {
          case "Price, Low to High":
            sortedProducts.sort((a, b) =>
              parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
            );
            break;
          case "Price, High to Low":
            sortedProducts.sort((a, b) =>
              parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
            );
            break;
          default:
            break;
        }

        setProducts(sortedProducts);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    console.log("--> SHOP PAGE CLIENT RENDERED (URL:", window.location.pathname, ")");
    applyClientSideFiltersAndSort();
  }, [appliedFilters, appliedSort, initialProducts]);

  const filterButtonLabel = useMemo(() => {
    const allFilters = [...appliedFilters.size, ...appliedFilters.category, ...appliedFilters.gender];

    if (allFilters.length === 0) {
      return "+ Filter";
    }

    if (allFilters.length <= 2) {
      return `+ ${allFilters.join(", ")}`;
    }

    return `+ ${allFilters[0]}, ${allFilters[1]} +${allFilters.length - 2}`;
  }, [appliedFilters]);

  const sortButtonLabel = useMemo(() => {
    return `Sort by: ${appliedSort}`;
  }, [appliedSort]);

  const handleApplyFilters = (filters: FilterSelections) => {
    setAppliedFilters(filters);
    setShowFilter(false);
  };

  const handleApplySort = (sort: string) => {
    setAppliedSort(sort);
    setShowSort(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isMobile ? (
        <>
          <MobileHeader onMenuClick={toggleMobileMenu} />
          {mobileMenuOpen && <MobileMenu onClose={() => setMobileMenuOpen(false)} />}
        </>
      ) : (
        <Header />
      )}
      <main className="flex-1">
        <div className="relative w-full h-[477px] md:h-[608px]">
          <Image
            src="/images/shop.png"
            alt="Collections End of Summer"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          {isMobile ? (
            <div className="absolute w-full flex justify-center bottom-14 text-center items-center">
              <h1 className="flex flex-col gap-2 text-4xl font-bold font-avant-garde tracking-wide text-white">
                <p>
                  COLLECTIONS:
                </p>
                <p>
                  END OF <span className="italic">SUMMER</span>
                </p>
              </h1>
            </div>
          ) : (
            <div className="absolute inset-y-0 right-0 flex items-center pr-12">
              <h1 className="text-4xl font-bold font-avant-garde tracking-wide text-white">
                COLLECTIONS END OF <span className="italic">SUMMER</span>
              </h1>
            </div>
          )}
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mb-12">
            <p className="text-xs md:text-sm font-avant-garde">
              Explore our performance-driven essentials merge cutting-edge innovation with the demands of real-world
              running. Designed for the tropics, each piece balances breathability, durability, and adaptive comfort.
              Every piece is crafted to support the runners journey, from training to race day and beyond.
            </p>
          </div>

          <div className={`flex flex-wrap justify-between items-center ${isMobile ? "mb-2" : "border-b border-gray-200 mb-8"} pb-4`}>
            {isMobile ? (
              <>
                <div className="flex w-full justify-between">
                  <div>
                    <button onClick={() => setShowFilter(true)} className="text-sm font-avant-garde">
                      {filterButtonLabel}
                    </button>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <button onClick={() => setShowSort(true)} className="text-sm font-avant-garde">
                        {sortButtonLabel}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <span className="text-sm font-avant-garde text-gray-500">{products.length} ITEMS</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex space-x-20 mb-4 md:mb-0">
                  <CustomDropdown options={sizeOptions} value={size} onChange={setSize} placeholder="Size" />
                  <CustomDropdown
                    options={categoryOptions}
                    value={category}
                    onChange={setCategory}
                    placeholder="Category"
                  />
                  <CustomDropdown options={genderOptions} value={gender} onChange={setGender} placeholder="Men" />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-avant-garde text-gray-500">{products.length} ITEMS</span>
                  <span>|</span>
                  <div className="flex items-center">
                    <span className="text-sm font-avant-garde mr-2">Sort By:</span>
                    <CustomDropdown isSort={true} options={sortOptions} value={sortBy} onChange={setSortBy} placeholder="Featured" />
                  </div>
                </div>
              </>
            )}
          </div>

          {loading && <p className="text-center py-8">Loading products...</p>}
          {error && <p className="text-center py-8 text-red-500">Error loading products: {error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-center py-8">No products found.</p>
          )}

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-[15px] md:gap-6">
            {!loading && !error && products.map((product) => (
              <ProductCard key={product.id} product={product} isShop={true} />
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <button className="border border-black px-8 py-3 text-sm font-avant-garde hover:bg-black hover:text-white transition-colors">
              LOAD MORE
            </button>
          </div>
        </div>
      </main>
      <Footer />
      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onApplyFilters={handleApplyFilters}
          initialFilters={appliedFilters}
        />
      )}

      {showSort && (
        <SortModal onClose={() => setShowSort(false)} onApplySort={handleApplySort} initialSort={appliedSort} />
      )}
    </div>
  );
}