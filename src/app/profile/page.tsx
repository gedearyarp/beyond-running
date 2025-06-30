"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import Loading from "@/components/ui/loading"
import { getAllCollections } from "@/lib/shopify"
import { Collection } from "@/lib/shopify/types"
import { User } from "@/types/api"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

interface LineItem {
  id: number;
  sku: string;
  name: string;
  grams: number;
  price: string;
  title: string;
  duties: unknown[];
  vendor: string;
  taxable: boolean;
  quantity: number;
  gift_card: boolean;
  price_set: unknown;
  tax_lines: unknown[];
  product_id: number;
  properties: unknown[];
  variant_id: number;
  variant_title: string;
  product_exists: boolean;
  total_discount: string;
  current_quantity: number;
  attributed_staffs: unknown[];
  requires_shipping: boolean;
  fulfillment_status: string | null;
  total_discount_set: unknown;
  fulfillment_service: string;
  admin_graphql_api_id: string;
  discount_allocations: unknown[];
  fulfillable_quantity: number;
  sales_line_item_group_id: string | null;
  variant_inventory_management: string;
}

interface OrderData {
  id: number;
  name: string;
  order_status_url?: string;
  total_price: string;
  line_items: LineItem[];
  [key: string]: unknown;
}

interface Order {
  id: string;
  created_at: string;
  order_data: OrderData | string;
}

interface CompleteUser extends User {
  address?: string
  phone?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || authLoading) return

    // If user is not authenticated, redirect to signin
    if (!isAuthenticated || !user) {
      router.replace('/signin')
      return
    }
  }, [mounted, authLoading, isAuthenticated, user, router])

  // Fetch collections
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

  // Fetch order history from Supabase
  useEffect(() => {
    if (!user?.email) return
    setOrdersLoading(true)
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('order_history')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
        if (error) throw error
        setOrders(data || [])
      } catch (err) {
        console.error('Failed to fetch order history:', err)
        setOrders([])
      } finally {
        setOrdersLoading(false)
      }
    }
    fetchOrders()
  }, [user?.email])

  // Show a blank loading state on server-side or while loading orders
  if (!mounted || authLoading || !user || ordersLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header collections={collections} />
        <main className="pt-32 md:pt-36 pb-12 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Loading text="Loading profile..." />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Helper to format price
  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return `IDR. ${num.toLocaleString("id-ID")},-`
  }

  console.log(user)

  return (
    <div className="min-h-screen bg-white">
      <Header collections={collections} />

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
              </div>
            </div>
          </div>

          {/* Order History Section */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-black mb-6 md:mb-8">ORDER HISTORY ({orders.length.toString().padStart(2, '0')})</h2>

            {/* Mobile View - Cards */}
            <div className="block md:hidden space-y-4">
              {orders.length === 0 && (
                <div className="text-gray-500 text-center py-8">No orders found.</div>
              )}
              {orders.map((order) => {
                const orderData: OrderData = typeof order.order_data === 'string' ? JSON.parse(order.order_data) : order.order_data;
                const lineItems: LineItem[] = orderData?.line_items || [];
                return (
                  <div key={order.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-black">{orderData.name || `#${order.id}`}</p>
                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <a href={orderData.order_status_url} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 text-xs font-medium hover:bg-gray-900 transition-colors rounded">ORDER STATUS</a>
                    </div>
                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      {lineItems.map((item: LineItem, idx: number) => (
                        <div key={item.id || idx} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-700">{item.title}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-black">{formatPrice(item.price)}</p>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-700">Total:</p>
                        <p className="font-medium text-black">{formatPrice(orderData.total_price)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-0 text-sm font-medium text-black uppercase tracking-wider">
                      ORDER
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">
                      ORDER DATE
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">
                      ITEM(S)
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">QTY</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-black uppercase tracking-wider">
                      TOTAL PRICE
                    </th>
                    <th className="text-right py-4 px-0 text-sm font-medium text-black uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="text-gray-500 text-center py-8">No orders found.</td></tr>
                  )}
                  {orders.map((order) => {
                    const orderData: OrderData = typeof order.order_data === 'string' ? JSON.parse(order.order_data) : order.order_data;
                    const lineItems: LineItem[] = orderData?.line_items || [];
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-6 px-0 text-black font-medium">{orderData.name || `#${order.id}`}</td>
                        <td className="py-6 px-4 text-gray-700">{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                        <td className="py-6 px-4">
                          <div className="space-y-1">
                            {lineItems.map((item: LineItem, idx: number) => (
                              <div key={item.id || idx} className="text-gray-700">{item.title}</div>
                            ))}
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <div className="space-y-1">
                            {lineItems.map((item: LineItem, idx: number) => (
                              <div key={item.id || idx} className="text-gray-700">x{item.quantity}</div>
                            ))}
                          </div>
                        </td>
                        <td className="py-6 px-4 text-black font-medium">{formatPrice(orderData.total_price)}</td>
                        <td className="py-6 px-0 text-right">
                          <a href={orderData.order_status_url} target="_blank" rel="noopener noreferrer" className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-900 transition-colors rounded">ORDER STATUS</a>
                        </td>
                      </tr>
                    )
                  })}
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
