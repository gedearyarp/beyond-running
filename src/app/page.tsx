import { getAllCollections } from "@/lib/shopify";
import { headers } from "next/headers";
import HomePageClient from "./client";
import { Collection } from "@/lib/shopify/types";

export default async function HomePage() {
    // Get country code from headers set by middleware
    const headersList = await headers();
    const countryCode = headersList.get("x-country-code") || "ID";

    let collections: Collection[] = [];

    try {
        collections = await getAllCollections(countryCode);
    } catch (error) {
        console.error("Failed to fetch collections:", error);
    }

    return <HomePageClient collections={collections} />;
}
