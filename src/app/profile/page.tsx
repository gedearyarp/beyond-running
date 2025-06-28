"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import { User } from "@/types/api"

interface Order {
  id: string
  date: string
  item: string
  quantity: number
  totalPrice: number
}

interface CompleteUser extends User {
  address?: string
  phone?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<CompleteUser | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if user is logged in
    const userStr = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')

    // If no user data or token, redirect to signin
    if (!userStr || !token) {
      router.replace('/signin')
      return
    }

    try {
      const userData = JSON.parse(userStr)
      setUser(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.replace('/signin')
    }
  }, [mounted, router])

  // Show a blank loading state on server-side
  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 md:pt-36 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const orders: Order[] = [
    {
      id: "12009",
      date: "October 17, 2024",
      item: "Beater Long Sleeve",
      quantity: 1,
      totalPrice: 480000,
    },
    {
      id: "12010",
      date: "October 21, 2024",
      item: "Beater Long Sleeve",
      quantity: 1,
      totalPrice: 1480000,
    },
  ]

  const formatPrice = (price: number) => {
    return `IDR. ${price.toLocaleString("id-ID")},-`
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 md:mb-20">
            {/* Left Side - Welcome Message */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                WELCOME BACK,
                <br />
                {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
              </h1>
            </div>

            {/* Right Side - User Info */}
            <div className="lg:col-span-1">
              <div className="space-y-2 text-left lg:text-right">
                <p className="text-base md:text-lg font-medium text-black">{user.firstName} {user.lastName}</p>
                <p className="text-sm md:text-base text-gray-600">{user.email}</p>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {user.address || 'No address provided'}
                  <br />
                  {user.phone || 'No phone number provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8">ORDER HISTORY (04)</h2>

            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-black">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <button className="bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-900 transition-colors">
                      REORDER
                    </button>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-700">{order.item}</p>
                        <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                      </div>
                      <p className="font-medium text-black">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order 12010 with multiple items - Mobile */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-black">#12010</p>
                    <p className="text-sm text-gray-600">October 21, 2024</p>
                  </div>
                  <button className="bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-900 transition-colors">
                    REORDER
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">Beater Long Sleeve</p>
                      <p className="text-xs text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">Beater Short Sleeve</p>
                      <p className="text-xs text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-700">Running Cap</p>
                      <p className="text-xs text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Total:</p>
                    <p className="font-medium text-black">{formatPrice(1480000)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-0 text-sm font-medium text-black uppercase tracking-wider">
                      2025
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">
                      ORDER DATE
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">
                      ITEM
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">QTY</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">
                      TOTAL PRICE
                    </th>
                    <th className="text-right py-4 px-0 text-sm font-medium text-black uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-6 px-0 text-black font-medium">{order.id}</td>
                      <td className="py-6 px-4 text-gray-700">{order.date}</td>
                      <td className="py-6 px-4 text-gray-700">{order.item}</td>
                      <td className="py-6 px-4 text-gray-700">x{order.quantity}</td>
                      <td className="py-6 px-4 text-black font-medium">{formatPrice(order.totalPrice)}</td>
                      <td className="py-6 px-0 text-right">
                        <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-900 transition-colors">
                          REORDER
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Order 12010 with multiple items */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-6 px-0 text-black font-medium">12010</td>
                    <td className="py-6 px-4 text-gray-700">October 21, 2024</td>
                    <td className="py-6 px-4">
                      <div className="space-y-1">
                        <div className="text-gray-700">Beater Long Sleeve</div>
                        <div className="text-gray-700">Beater Short Sleeve</div>
                        <div className="text-gray-700">Running Cap</div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="space-y-1">
                        <div className="text-gray-700">x1</div>
                        <div className="text-gray-700">x1</div>
                        <div className="text-gray-700">x1</div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-black font-medium">{formatPrice(1480000)}</td>
                    <td className="py-6 px-0 text-right">
                      <button className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-900 transition-colors">
                        REORDER
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
