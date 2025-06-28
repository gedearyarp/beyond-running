"use client"

import { useState, useRef, useEffect } from "react"
import { Plus } from "lucide-react"

interface DropdownOption {
  value: string
  label: string
}

interface CustomDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  isSort?: boolean
}

export default function CustomDropdown({ isSort, options, value, onChange, placeholder }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get the selected option label
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button type="button" className="flex items-center justify-center text-sm font-avant-garde cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {!isSort && <Plus className="mr-2 h-3 w-3" />} {selectedOption ? selectedOption.label : placeholder} 
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white shadow-md rounded-none border border-gray-100">
          {options.map((option) => (
            <button
              key={option.value}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 font-avant-garde cursor-pointer"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
