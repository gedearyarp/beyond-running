import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

// Locale configuration - simplified untuk 3 currency focus
const locales = ["en-US", "id-ID", "en-GB"];
const defaultLocale = "id-ID";

// Valid currency codes
const VALID_CURRENCIES = ["IDR", "USD", "GBP"];

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
    // SIMPLE & RELIABLE: Read Vercel geo headers directly
    // Vercel provides: X-Vercel-IP-Country, X-Vercel-IP-Country-Region, X-Vercel-IP-City
    // This header is automatically set by Vercel in production based on user's IP
    const geoCountry = request.headers.get("x-vercel-ip-country");
    
    // Check cookie (for fallback only)
    const currencyPreference = request.cookies.get("currency-preference")?.value;
    const countryPreference = request.cookies.get("country-preference")?.value;

    let countryCode: string;
    let currencyCode: string;

    // Priority 1: Vercel geo header (X-Vercel-IP-Country) - always adapt to current location
    if (geoCountry && isValidCountry(geoCountry)) {
        // ID → IDR, GB → GBP, lainnya → USD
        countryCode = geoCountry;
        currencyCode = getCurrencyFromCountry(countryCode);
    } else if (countryPreference && currencyPreference) {
        // Priority 2: Cookie preference (fallback when geo header is not available)
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
        // Priority 3: Default fallback
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
