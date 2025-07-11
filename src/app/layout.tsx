import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import "./fonts.css";
import Header from "@/components/ui/Header";
import CartValidationProvider from "@/components/cart-validation-provider";
import { LoadingProvider } from "@/components/ui/loading-provider";
import NavigationLoading from "@/components/ui/navigation-loading";
import { AuthProvider } from "@/contexts/AuthContext";
import { getAllCollections } from "@/lib/shopify";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Beyond Running",
    description: "Beyond Running - Your Ultimate Running Companion",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Fetch collections on initial load
    const collections = await getAllCollections();

    return (
        <html lang="en">
            <body className={`${inter.className} font-avant-garde`}>
                <AuthProvider>
                    <LoadingProvider>
                        <Suspense fallback={null}>
                            <NavigationLoading />
                        </Suspense>
                        {/* Header selalu ada */}
                        {/* <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/90 shadow-lg border-b border-white/20">
              <Header collections={collections} />
            </div> */}
                        <main>{children}</main>
                        <CartValidationProvider />
                        <Toaster />
                    </LoadingProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
