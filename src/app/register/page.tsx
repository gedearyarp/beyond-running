"use client"

import { useState, useEffect } from "react"
import Header from "@/components/ui/Header"
import SignupForm from "@/components/ui/RegisterForm"
import Footer from "@/components/ui/Footer"
import Loading from "@/components/ui/loading"
import { getAllCollections } from "@/lib/shopify"
import { Collection } from "@/lib/shopify/types"

export default function RegisterPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true)
        const collectionsData = await getAllCollections()
        setCollections(collectionsData)
      } catch (error) {
        console.error("Failed to fetch collections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading text="Loading..." />
      </div>
    )
  }

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
