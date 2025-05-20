"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import BaseModal from "./base-modal"

interface SortModalProps {
  onClose: () => void
  onApplySort: (sort: string) => void
  initialSort: string
}

export default function SortModal({ onClose, onApplySort, initialSort }: SortModalProps) {
  const [selectedSort, setSelectedSort] = useState<string>(initialSort)
  const [expanded, setExpanded] = useState(true)

  const sortOptions = ["Featured", "New Arrivals", "Price: Low to High", "Price: High to Low"]

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleReset = () => {
    setSelectedSort("Featured")
  }

  const handleApply = () => {
    onApplySort(selectedSort)
    onClose()
  }

  return (
    <BaseModal title="+ Sort by:" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleExpanded}>
          <h3 className="text-2xl font-medium">Sort By:</h3>
          {expanded ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expanded && (
          <div className="space-y-4">
            {sortOptions.map((option) => (
              <div
                key={option}
                className={`text-xl cursor-pointer flex items-center ${selectedSort === option ? "font-semibold" : ""}`}
                onClick={() => setSelectedSort(option)}
              >
                <div
                  className={`w-5 h-5 rounded-full border border-black mr-2 flex items-center justify-center ${selectedSort === option ? "bg-black" : "bg-white"}`}
                >
                  {selectedSort === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                </div>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  )
}
