'use client'

import { useState } from 'react'

interface RadioOptionProps {
  optionId: string
  text: string
  isSelected: boolean
  onSelect: (optionId: string) => void
}

export function RadioOption({ optionId, text, isSelected, onSelect }: RadioOptionProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    console.log('=== RadioOption clicked ===')
    console.log('Option ID:', optionId)
    console.log('Text:', text)
    console.log('Is Selected:', isSelected)
    console.log('=== Calling onSelect ===')
    
    setIsClicked(true)
    onSelect(optionId)
    
    // Reset click state after a short delay
    setTimeout(() => setIsClicked(false), 100)
  }

  return (
    <div
      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      } ${isClicked ? 'ring-2 ring-blue-300' : ''}`}
      onClick={handleClick}
    >
      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
        isSelected 
          ? 'border-blue-500 bg-blue-500' 
          : 'border-gray-300'
      }`}>
        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  )
}
