import { getAllCollections } from "@/lib/shopify"
import HomePageClient from "./client"
import { Collection } from "@/lib/shopify/types"

export default async function HomePage() {
  let collections: Collection[] = []

  try {
    collections = await getAllCollections()
  } catch (error) {
    console.error("Failed to fetch collections:", error)
  }

  return <HomePageClient collections={collections} />
}
