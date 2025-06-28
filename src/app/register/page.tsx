"use client"

import { useState, useEffect } from "react"
import Header from "@/components/ui/Header"
import SignupForm from "@/components/ui/RegisterForm"
import Footer from "@/components/ui/Footer"
import { getAllCollections } from "@/lib/shopify"
import { Collection } from "@/lib/shopify/types"

export default function RegisterPage() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const collectionsData = await getAllCollections()
        setCollections(collectionsData)
      } catch (error) {
        console.error("Failed to fetch collections:", error)
      }
    }

    fetchCollections()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header collections={collections} />
      <main className="flex items-start justify-center pt-42 pb-16 md:h-screen">
        <SignupForm />
      </main>
      <Footer />
    </div>
  )
}
