"use client"

import { useState } from "react"
import BaseModal from "./base-modal"

interface FilterModalProps {
  onClose: () => void
  onApplyViewType: (viewType: string) => void
  initialViewType: string
}

export default function CommunityFilterModal({ onClose, onApplyViewType, initialViewType }: FilterModalProps) {
  const [selectedViewType, setSelectedViewType] = useState<string>(initialViewType)

  const viewTypeOptions = ["Grid View", "List View", "Calendar View"]

  const handleReset = () => {
    const resetViewType = "Grid View"
    setSelectedViewType(resetViewType)
    onApplyViewType(resetViewType)
    onClose()
  }

  const handleApply = () => {
    onApplyViewType(selectedViewType)
    onClose()
  }

  return (
    <BaseModal 
      title="+ Filter" 
      onClose={onClose} 
      onReset={handleReset} 
      onApply={handleApply}
      slideDirection="left"
    >
      {/* View Type Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-medium font-avant-garde mb-4">View Type:</h3>
        <div className="space-y-4">
          {viewTypeOptions.map((option) => (
            <div
              key={option}
              className={`text-xl cursor-pointer font-avant-garde ${
                selectedViewType === option ? "font-semibold" : ""
              }`}
              onClick={() => setSelectedViewType(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  )
}
