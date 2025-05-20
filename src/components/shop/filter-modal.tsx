"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import BaseModal from "./base-modal"

export interface FilterSelections {
  size: string[]
  category: string[]
  gender: string[]
}

interface FilterModalProps {
  onClose: () => void
  onApplyFilters: (filters: FilterSelections) => void
  initialFilters: FilterSelections
}

export default function FilterModal({ onClose, onApplyFilters, initialFilters }: FilterModalProps) {
  const [expandedSections, setExpandedSections] = useState({
    size: true,
    category: true,
    gender: false,
  })

  const [selectedFilters, setSelectedFilters] = useState<FilterSelections>(initialFilters)

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleFilter = (section: keyof FilterSelections, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = [...prev[section]]
      const index = currentFilters.indexOf(value)

      if (index === -1) {
        // Add filter
        return { ...prev, [section]: [...currentFilters, value] }
      } else {
        // Remove filter
        currentFilters.splice(index, 1)
        return { ...prev, [section]: currentFilters }
      }
    })
  }

  const isFilterSelected = (section: keyof FilterSelections, value: string) => {
    return selectedFilters[section].includes(value)
  }

  const handleReset = () => {
    setSelectedFilters({ size: [], category: [], gender: [] })
  }

  const handleApply = () => {
    onApplyFilters(selectedFilters)
    onClose()
  }

  return (
    <BaseModal title="+ Filter" onClose={onClose} onReset={handleReset} onApply={handleApply}>
      {/* Size Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection("size")}>
          <h3 className="text-2xl font-medium">Size</h3>
          {expandedSections.size ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expandedSections.size && (
          <div className="space-y-4">
            {["Size 1", "Size 2", "Size 3", "One Size Fit All"].map((size) => (
              <div
                key={size}
                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("size", size) ? "font-semibold" : ""}`}
                onClick={() => toggleFilter("size", size)}
              >
                <div
                  className={`w-5 h-5 border border-black mr-2 flex items-center justify-center ${isFilterSelected("size", size) ? "bg-black" : "bg-white"}`}
                >
                  {isFilterSelected("size", size) && <span className="text-white text-xs">✓</span>}
                </div>
                {size}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="mb-8">
        <div
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={() => toggleSection("category")}
        >
          <h3 className="text-2xl font-medium">Category</h3>
          {expandedSections.category ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expandedSections.category && (
          <div className="space-y-4">
            {["New Arrivals", "Running Tops", "Running Bottoms", "Outerwear", "Postrun", "Accessories"].map(
              (category) => (
                <div
                  key={category}
                  className={`text-xl cursor-pointer flex items-center ${isFilterSelected("category", category) ? "font-semibold" : ""}`}
                  onClick={() => toggleFilter("category", category)}
                >
                  <div
                    className={`w-5 h-5 border border-black mr-2 flex items-center justify-center ${isFilterSelected("category", category) ? "bg-black" : "bg-white"}`}
                  >
                    {isFilterSelected("category", category) && <span className="text-white text-xs">✓</span>}
                  </div>
                  {category}
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* Gender Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection("gender")}>
          <h3 className="text-2xl font-medium">Gender</h3>
          {expandedSections.gender ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expandedSections.gender && (
          <div className="space-y-4">
            {["Men", "Women", "Unisex"].map((gender) => (
              <div
                key={gender}
                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("gender", gender) ? "font-semibold" : ""}`}
                onClick={() => toggleFilter("gender", gender)}
              >
                <div
                  className={`w-5 h-5 border border-black mr-2 flex items-center justify-center ${isFilterSelected("gender", gender) ? "bg-black" : "bg-white"}`}
                >
                  {isFilterSelected("gender", gender) && <span className="text-white text-xs">✓</span>}
                </div>
                {gender}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  )
}
