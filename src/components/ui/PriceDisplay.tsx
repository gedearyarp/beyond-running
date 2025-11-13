"use client";

import { useLocalization } from "@/contexts/LocalizationContext";
import { getFallbackRates } from "@/lib/currency";

type Price = {
    amount: string;
    currencyCode: string; // Ini adalah currencyCode DARI SHOPIFY (misal "IDR")
};

type Rates = {
    [key: string]: number;
};

interface PriceDisplayProps {
    price: Price;
    rates: Rates;
    className?: string;
}

export function PriceDisplay({ price, rates, className }: PriceDisplayProps) {
    const { currencyCode: targetCurrency, locale } = useLocalization();

    // Use fallback rates if rates object is empty or doesn't have target currency
    const effectiveRates = Object.keys(rates).length > 0 ? rates : getFallbackRates();

    let displayAmount: number;
    let displayCurrency: string = targetCurrency;

    // Validate and parse amount
    const baseAmount = parseFloat(price.amount);
    const baseCurrency = price.currencyCode; // Selalu IDR dari Shopify

    // Handle invalid amount
    if (isNaN(baseAmount) || baseAmount < 0) {
        return <span className={className}>Price not available</span>;
    }

    if (targetCurrency === baseCurrency) {
        // Jika user di Indonesia, tampilkan harga IDR
        displayAmount = baseAmount;
    } else {
        // Jika user di luar negeri, konversi
        // Rate dari API adalah: 1 IDR = X targetCurrency
        // Jadi kita perlu: amount IDR * rate = amount targetCurrency
        const rate = effectiveRates[targetCurrency];
        if (rate && !isNaN(rate) && rate > 0) {
            // Konversi dari IDR ke targetCurrency
            displayAmount = baseAmount * rate;
        } else {
            // Fallback jika kurs tidak ditemukan, gunakan fallback rates
            const fallbackRates = getFallbackRates();
            const fallbackRate = fallbackRates[targetCurrency];
            if (fallbackRate) {
                displayAmount = baseAmount * fallbackRate;
            } else {
                // Last resort: tampilkan IDR
                displayAmount = baseAmount;
                displayCurrency = baseCurrency;
            }
        }
    }

    // Format harga menggunakan Intl.NumberFormat
    try {
        const formattedPrice = new Intl.NumberFormat(locale, {
            style: "currency",
            currency: displayCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(displayAmount);

        return <span className={className}>{formattedPrice}</span>;
    } catch (error) {
        // Fallback formatting if Intl.NumberFormat fails
        console.error("Error formatting price:", error);
        return (
            <span className={className}>
                {displayCurrency} {displayAmount.toFixed(2)}
            </span>
        );
    }
}



