"use client"

import Image from "next/image"
import toast, { Toast } from "react-hot-toast"

interface Product {
  image: string
  title: string
  variantTitle?: string
}

const AddedToCartToast = ({ t, product }: { t: Toast; product: Product }) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5`}
      role="alert"
    >
      <Image src={product.image} alt={product.title} width={48} height={48} className="w-12 h-12 rounded-md" />
      <div className="pl-4 text-sm font-normal">
        <p className="font-bold text-gray-900">{product.title}</p>
        {product.variantTitle && <p className="text-gray-600">{product.variantTitle}</p>}
        <p>Was added to the cart.</p>
      </div>
    </div>
  )
}

export const showProcessingToast = (): string => {
  return toast.loading("Adding to cart...", {
    position: "bottom-right",
  })
}

export const showSuccessToast = (product: Product, toastId: string): void => {
  toast.custom((t) => <AddedToCartToast t={t} product={product} />, {
    id: toastId,
    position: "bottom-right",
    duration: 3000,
  })
}

export const showErrorToast = (message: string, toastId?: string): void => {
  toast.error(message, {
    id: toastId,
    position: "bottom-right",
  })
} 