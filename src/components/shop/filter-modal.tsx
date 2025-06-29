"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"
import BaseModal from "./base-modal"

export interface FilterSelections {
  size: string[]
  category: string[]
  gender: string[]
}

export interface FilterOption {
  value: string
  label: string
}

interface FilterModalProps {
  onClose: () => void
  onApplyFilters: (filters: FilterSelections) => void
  initialFilters: FilterSelections
  sizeOptions: FilterOption[]
  categoryOptions: FilterOption[]
  genderOptions: FilterOption[]
}

export default function FilterModal({ 
  onClose, 
  onApplyFilters, 
  initialFilters, 
  sizeOptions, 
  categoryOptions, 
  genderOptions 
}: FilterModalProps) {
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
    const resetFilters = { size: [], category: [], gender: [] }
    setSelectedFilters(resetFilters)
    onApplyFilters(resetFilters)
    onClose()
  }

  const handleApply = () => {
    onApplyFilters(selectedFilters)
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
      {/* Size Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => toggleSection("size")}>
          <h3 className="text-2xl font-medium">Size</h3>
          {expandedSections.size ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </div>
        {expandedSections.size && (
          <div className="space-y-4">
            {sizeOptions.map((size) => (
              <div
                key={size.value}
                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("size", size.label) ? "font-semibold" : ""}`}
                onClick={() => toggleFilter("size", size.label)}
              >
                <div
                  className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("size", size.label) ? "bg-black" : "bg-white"}`}
                >
                  {isFilterSelected("size", size.label) && <span className="text-white text-xs">✓</span>}
                </div>
                {size.label}
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
            {categoryOptions.map((category) => (
              <div
                key={category.value}
                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("category", category.label) ? "font-semibold" : ""}`}
                onClick={() => toggleFilter("category", category.label)}
              >
                <div
                  className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("category", category.label) ? "bg-black" : "bg-white"}`}
                >
                  {isFilterSelected("category", category.label) && <span className="text-white text-xs">✓</span>}
                </div>
                {category.label}
              </div>
            ))}
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
            {genderOptions.map((gender) => (
              <div
                key={gender.value}
                className={`text-xl cursor-pointer flex items-center ${isFilterSelected("gender", gender.label) ? "font-semibold" : ""}`}
                onClick={() => toggleFilter("gender", gender.label)}
              >
                <div
                  className={`w-5 h-5 border border-black mr-2 flex items-center justify-center cursor-pointer ${isFilterSelected("gender", gender.label) ? "bg-black" : "bg-white"}`}
                >
                  {isFilterSelected("gender", gender.label) && <span className="text-white text-xs">✓</span>}
                </div>
                {gender.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseModal>
  )
}
