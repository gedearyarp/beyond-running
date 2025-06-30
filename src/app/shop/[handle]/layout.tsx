// app/shop/[handle]/layout.tsx
// Ini adalah Server Component yang akan fetch data untuk halaman detail produk

import { getAllCollections } from "@/lib/shopify";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // Pastikan ini dinamis untuk pengembangan

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}

export async function generateStaticParams() {
    const collections = await getAllCollections();
    return collections.map((collection) => ({ handle: collection.handle }));
}
