import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Extend NextRequest to include Vercel's geo property
interface VercelRequest extends NextRequest {
    geo?: {
        country?: string;
        city?: string;
        region?: string;
    };
}

// Locale configuration - simplified untuk 3 currency focus
const locales = ["en-US", "id-ID", "en-GB"];
const defaultLocale = "id-ID";

// Valid currency codes
const VALID_CURRENCIES = ["IDR", "USD", "GBP"];

// Valid country codes (for validation)
const VALID_COUNTRIES = ["ID", "GB", "US"]; // US included for USD

// Simplified currency mapping: ID→IDR, GB→GBP, lainnya→USD
function getCurrencyFromCountry(countryCode: string): string {
    if (countryCode === "ID") return "IDR";
    if (countryCode === "GB") return "GBP";
    return "USD"; // Default untuk semua negara lain
}

// Validate currency code
function isValidCurrency(currency: string): boolean {
    return VALID_CURRENCIES.includes(currency);
}

// Validate country code (basic validation)
function isValidCountry(country: string): boolean {
    // Allow any 2-letter country code, but validate format
    return /^[A-Z]{2}$/.test(country);
}

// Simplified locale mapping based on country
function getLocaleFromCountry(countryCode: string): string {
    if (countryCode === "ID") return "id-ID";
    if (countryCode === "GB") return "en-GB";
    return "en-US"; // Default untuk semua negara lain (USD)
}

function getLocale(request: NextRequest): string {
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => (headers[key] = value));

    const languages = new Negotiator({ headers }).languages();
    try {
        return match(languages, locales, defaultLocale);
    } catch {
        return defaultLocale;
    }
}

export function middleware(request: NextRequest) {
    const vercelRequest = request as VercelRequest;

    // Priority: 1. Vercel geo (always adapt to current location), 2. Query param (dev/testing), 3. Cookie (fallback), 4. Default
    const url = new URL(request.url);
    const mockCountry = url.searchParams.get("mock_country");
    
    // Check for currency preference in cookie (for fallback only)
    const currencyPreference = request.cookies.get("currency-preference")?.value;
    const countryPreference = request.cookies.get("country-preference")?.value;
    
    // Get Vercel geo country (primary source - always adapt to current location)
    const geoCountry = vercelRequest.geo?.country;

    let countryCode: string;
    let currencyCode: string;

    // Priority 1: Vercel geo detection (always adapt to current location)
    if (geoCountry) {
        // Always use geo country if available - this ensures currency adapts to user's current location
        // ID → IDR, GB → GBP, lainnya → USD
        countryCode = geoCountry;
        currencyCode = getCurrencyFromCountry(countryCode);
    } else if (process.env.NODE_ENV === "development" && mockCountry) {
        // Priority 2: Query parameter in development mode for testing
        countryCode = mockCountry.toUpperCase();
        currencyCode = getCurrencyFromCountry(countryCode);
    } else if (countryPreference && currencyPreference) {
        // Priority 3: Cookie preference (fallback when geo is not available)
        // Validate cookie values
        if (isValidCountry(countryPreference) && isValidCurrency(currencyPreference)) {
            countryCode = countryPreference;
            currencyCode = currencyPreference;
        } else {
            // Invalid cookie values, use default
            console.warn("Invalid cookie values, using default:", { countryPreference, currencyPreference });
            countryCode = "ID";
            currencyCode = getCurrencyFromCountry(countryCode);
        }
    } else {
        // Priority 4: Default fallback
        countryCode = "ID";
        currencyCode = getCurrencyFromCountry(countryCode);
    }

    // Get locale - try browser preference first, then country-based, then default
    const browserLocale = getLocale(request);
    const locale = getLocaleFromCountry(countryCode) || browserLocale || defaultLocale;

    // Create response
    const response = NextResponse.next();

    // Add headers for Server Components
    response.headers.set("x-country-code", countryCode);
    response.headers.set("x-currency-code", currencyCode);
    response.headers.set("x-locale", locale);

    // Always update cookies with current country/currency (so it persists for next visit if geo unavailable)
    const cookieExpiry = new Date();
    cookieExpiry.setDate(cookieExpiry.getDate() + 30);
    
    response.cookies.set("country-preference", countryCode, {
        expires: cookieExpiry,
        path: "/",
        sameSite: "lax",
    });
    
    response.cookies.set("currency-preference", currencyCode, {
        expires: cookieExpiry,
        path: "/",
        sameSite: "lax",
    });

    return response;
}

// Configure which routes should run this middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
