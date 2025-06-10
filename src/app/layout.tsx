import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./fonts.css"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import { getAllCollections } from "@/lib/shopify"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Beyond Running",
  description: "Beyond Running - Your Ultimate Running Companion",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch collections on initial load
  const collections = await getAllCollections();

  return (
    <html lang="en">
      <body className={`${inter.className} font-avant-garde pt-[88px]`}>
        <Header collections={collections} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
