"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import BaseModal from "./base-modal"

interface SortModalProps {
  onClose: () => void
  onApplySort: (sort: string) => void
  initialSort: string
}

export default function PeripheralsSortModal({ onClose, onApplySort, initialSort }: SortModalProps) {
  const [selectedSort, setSelectedSort] = useState<string>(initialSort)
  const [expanded, setExpanded] = useState(true)

  const sortOptions = ["Featured", "Newest to Oldest", "Oldest to Newest"]

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const handleReset = () => {
    const resetSort = "Featured"
    setSelectedSort(resetSort)
    onApplySort(resetSort)
    onClose()
  }

  const handleApply = () => {
    onApplySort(selectedSort)
    onClose()
  }

  return (
    <BaseModal title="+ Filter" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={toggleExpanded}>
          <h3 className="text-2xl font-medium font-avant-garde">Sort By:</h3>
          {expanded ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expanded && (
          <div className="space-y-4">
            {sortOptions.map((option) => (
              <div
                key={option}
                className={`text-xl cursor-pointer font-avant-garde ${selectedSort === option ? "font-semibold" : ""}`}
                onClick={() => setSelectedSort(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  )
}
