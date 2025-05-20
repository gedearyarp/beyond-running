"use client"

import type { ReactNode } from "react"
import { X } from "lucide-react"

interface BaseModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  onReset?: () => void
  onApply?: () => void
  applyButtonText?: string
}

export default function BaseModal({
  title,
  onClose,
  children,
  onReset,
  onApply,
  applyButtonText = "APPLY FILTERS",
}: BaseModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-medium font-avant-garde">{title}</h2>
          <div className="flex items-center">
            <span className="mr-2 text-xl">Close</span>
            <button title="close-button" onClick={onClose} className="bg-[#d17928] p-2 flex items-center justify-center">
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">{children}</div>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <button onClick={onReset} className="py-4 bg-[#adadad] text-black font-medium font-avant-garde">
            RESET ALL
          </button>
          <button onClick={onApply} className="py-4 bg-black text-white font-medium font-avant-garde">
            {applyButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}
