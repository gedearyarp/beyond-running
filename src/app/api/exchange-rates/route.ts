import { NextResponse } from "next/server";
import { unstable_cache as cache } from "next/cache";
import { validateRates } from "@/lib/currency";

const BASE_CURRENCY = "IDR";

interface ExchangeRates {
    result: string;
    base_code: string;
    rates: {
        [key: string]: number;
    };
}

// Hardcoded fallback rates (same as currency.ts)
const FALLBACK_RATES: Record<string, number> = {
    IDR: 1, // Base currency
    USD: 0.000064, // Approx: 1 IDR = 0.000064 USD (15,625 IDR = 1 USD)
    GBP: 0.000050, // Approx: 1 IDR = 0.000050 GBP (20,000 IDR = 1 GBP)
};

function getFallbackRates(): Record<string, number> {
    return { ...FALLBACK_RATES };
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

// Server-side cached function
const getCachedExchangeRates = cache(
    async (): Promise<ExchangeRates["rates"]> => {
        try {
            // Try primary API first
            const response = await fetch(`https://open.er-api.com/v6/latest/${BASE_CURRENCY}`, {
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
    ["exchange-rates", BASE_CURRENCY],
    { revalidate: 14400 }
);

export async function GET() {
    try {
        const rates = await getCachedExchangeRates();
        // Validate rates before sending to client
        const validatedRates = validateRates(rates);
        return NextResponse.json(validatedRates);
    } catch (error) {
        console.error("Error in exchange rates API:", error);
        // Return hardcoded fallback rates if everything fails
        return NextResponse.json(getFallbackRates(), { status: 200 });
    }
}

