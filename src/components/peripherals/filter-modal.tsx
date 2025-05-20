"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import BaseModal from "./base-modal"

interface FilterModalProps {
  onClose: () => void
  onApplyFilters: (filters: { category: string; viewType: string }) => void
  initialFilters: { category: string; viewType: string }
}

export default function PeripheralsFilterModal({ onClose, onApplyFilters, initialFilters }: FilterModalProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    viewType: true,
  })

  const [selectedFilters, setSelectedFilters] = useState<{
    category: string
    viewType: string
  }>(initialFilters)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const categoryOptions = ["All Stories", "Discovery", "Clarity", "Community"]
  const viewTypeOptions = ["Grid View", "List View"]

  const handleReset = () => {
    setSelectedFilters({ category: "All Stories", viewType: "Grid View" })
  }

  const handleApply = () => {
    onApplyFilters(selectedFilters)
    onClose()
  }

  return (
    <BaseModal title="+ Filter" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      {/* Category Section */}
      <div className="mb-8">
        <div
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={() => toggleSection("category")}
        >
          <h3 className="text-2xl font-medium font-avant-garde">Category</h3>
          {expandedSections.category ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expandedSections.category && (
          <div className="space-y-4">
            {categoryOptions.map((option) => (
              <div
                key={option}
                className={`text-xl cursor-pointer font-avant-garde ${
                  selectedFilters.category === option ? "font-semibold" : ""
                }`}
                onClick={() => setSelectedFilters({ ...selectedFilters, category: option })}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Type Section */}
      <div className="mb-8">
        <div
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={() => toggleSection("viewType")}
        >
          <h3 className="text-2xl font-medium font-avant-garde">View Type</h3>
          {expandedSections.viewType ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expandedSections.viewType && (
          <div className="space-y-4">
            {viewTypeOptions.map((option) => (
              <div
                key={option}
                className={`text-xl cursor-pointer font-avant-garde ${
                  selectedFilters.viewType === option ? "font-semibold" : ""
                }`}
                onClick={() => setSelectedFilters({ ...selectedFilters, viewType: option })}
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
