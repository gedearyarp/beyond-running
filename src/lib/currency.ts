import { unstable_cache as cache } from "next/cache";

// Ganti 'IDR' jika mata uang dasar toko Anda berbeda
const BASE_CURRENCY = "IDR";

interface ExchangeRates {
    result: string;
    base_code: string;
    rates: {
        [key: string]: number;
    };
}

// Hardcoded fallback rates (update manual jika perlu)
// Rates: 1 IDR = X targetCurrency
// Update ini secara berkala untuk akurasi yang lebih baik
const FALLBACK_RATES: Record<string, number> = {
    IDR: 1, // Base currency
    USD: 0.000064, // Approx: 1 IDR = 0.000064 USD (15,625 IDR = 1 USD)
    GBP: 0.000050, // Approx: 1 IDR = 0.000050 GBP (20,000 IDR = 1 GBP)
};

// Helper function untuk get fallback rates
export function getFallbackRates(): Record<string, number> {
    return { ...FALLBACK_RATES };
}

// Rate validation - check if rate is reasonable
// Expected ranges: USD ~0.000064, GBP ~0.000050
function validateRate(currency: string, rate: number): boolean {
    if (!rate || isNaN(rate) || rate <= 0) return false;
    
    // Check if rate is within reasonable range (allow 50% deviation from fallback)
    const fallbackRate = FALLBACK_RATES[currency];
    if (fallbackRate) {
        const minRate = fallbackRate * 0.5; // 50% below
        const maxRate = fallbackRate * 1.5; // 50% above
        return rate >= minRate && rate <= maxRate;
    }
    
    // For unknown currencies, just check if it's positive and reasonable
    return rate > 0 && rate < 1; // Should be less than 1 for IDR base
}

// Validate and sanitize rates object
export function validateRates(rates: Record<string, number>): Record<string, number> {
    const validated: Record<string, number> = {};
    
    for (const [currency, rate] of Object.entries(rates)) {
        if (validateRate(currency, rate)) {
            validated[currency] = rate;
        } else {
            // Use fallback if rate is invalid
            if (FALLBACK_RATES[currency]) {
                validated[currency] = FALLBACK_RATES[currency];
                console.warn(`Invalid rate for ${currency}, using fallback`);
            }
        }
    }
    
    // Ensure we have at least fallback rates
    return Object.keys(validated).length > 0 ? validated : getFallbackRates();
}

// Try backup API if primary fails
async function fetchFromBackupAPI(): Promise<ExchangeRates["rates"] | null> {
    try {
        // Backup API: exchangerate-api.com (free tier)
        const response = await fetch(
            `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`,
            {
                next: { revalidate: 14400 },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        
        // exchangerate-api.com returns rates directly
        if (data.rates) {
            return data.rates;
        }
        
        return null;
    } catch (error) {
        console.error("Error fetching from backup API:", error);
        return null;
    }
}

// Server-side cached function (untuk Server Components)
export const getExchangeRates = cache(
    async (): Promise<ExchangeRates["rates"]> => {
        try {
            // Try primary API first
            const response = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`, {
                // Revalidasi cache setiap 4 jam
                next: { revalidate: 14400 },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch exchange rates");
            }

            const data: ExchangeRates = await response.json();

            if (data.result !== "success") {
                throw new Error("API did not return success");
            }

            // Validate rates before returning
            return validateRates(data.rates);
        } catch (error) {
            console.error("Error fetching from primary API, trying backup...", error);
            
            // Try backup API
            const backupRates = await fetchFromBackupAPI();
            if (backupRates) {
                console.log("Using backup API rates");
                // Validate backup rates too
                return validateRates(backupRates);
            }

            // If all APIs fail, use hardcoded fallback rates
            console.warn("All exchange rate APIs failed, using hardcoded fallback rates");
            return getFallbackRates();
        }
    },
    ["exchange-rates", BASE_CURRENCY], // Cache key
    { revalidate: 14400 }
);

// Client-side localStorage cache key
const CACHE_KEY = "exchange-rates-cache";
const CACHE_EXPIRY_KEY = "exchange-rates-cache-expiry";
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Get cached rates from localStorage
function getCachedRates(): Record<string, number> | null {
    if (typeof window === "undefined") return null;
    
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        
        if (!cached || !expiry) return null;
        
        const expiryTime = parseInt(expiry, 10);
        if (Date.now() > expiryTime) {
            // Cache expired, remove it
            localStorage.removeItem(CACHE_KEY);
            localStorage.removeItem(CACHE_EXPIRY_KEY);
            return null;
        }
        
        return JSON.parse(cached);
    } catch (error) {
        console.error("Error reading cached rates:", error);
        return null;
    }
}

// Save rates to localStorage cache
function setCachedRates(rates: Record<string, number>): void {
    if (typeof window === "undefined") return;
    
    try {
        const expiryTime = Date.now() + CACHE_DURATION;
        localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
        localStorage.setItem(CACHE_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
        console.error("Error caching rates:", error);
    }
}

// Client-side function (untuk Client Components) dengan localStorage caching
export async function fetchExchangeRatesClient(): Promise<ExchangeRates["rates"]> {
    // Check localStorage cache first
    const cachedRates = getCachedRates();
    if (cachedRates) {
        console.log("Using cached exchange rates from localStorage");
        return validateRates(cachedRates);
    }
    
    try {
        const response = await fetch("/api/exchange-rates", {
            cache: "no-store", // Client-side fetch tidak perlu revalidate
        });

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates");
        }

        const rates = await response.json();
        
        // Validate rates before caching
        const validatedRates = validateRates(rates);
        
        // Cache validated rates
        setCachedRates(validatedRates);
        
        return validatedRates;
    } catch (error) {
        console.error("Error fetching exchange rates from API:", error);
        // Use hardcoded fallback rates if API fails
        console.warn("Using hardcoded fallback rates");
        const fallbackRates = getFallbackRates();
        // Cache fallback rates too (so we don't keep trying API)
        setCachedRates(fallbackRates);
        return fallbackRates;
    }
}



