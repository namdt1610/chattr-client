'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Laptop, ChevronDown } from 'lucide-react'

export type UITheme = 'light' | 'dark' | 'system'

interface UISwitcherProps {
  initialTheme?: UITheme
  onThemeChange?: (theme: UITheme) => void
  className?: string
}

const UISwitcher: React.FC<UISwitcherProps> = ({
  initialTheme = 'system',
  onThemeChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<UITheme>(initialTheme)

  const handleThemeSelect = (theme: UITheme) => {
    setSelectedTheme(theme)
    setIsOpen(false)
    if (onThemeChange) {
      onThemeChange(theme)
    }
  }

  const themeOptions: { value: UITheme; label: string; icon: React.ReactNode }[] = [
    { 
      value: 'light', 
      label: 'Light', 
      icon: <Sun size={16} className="text-amber-500" /> 
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      icon: <Moon size={16} className="text-indigo-300" /> 
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: <Laptop size={16} className="text-zinc-500" /> 
    }
  ]

  const selectedOption = themeOptions.find(option => option.value === selectedTheme)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-sm transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span>{selectedOption?.label}</span>
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-zinc-400" />
        </motion.div>
      </button>

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={isOpen 
          ? { opacity: 1, y: 0, scale: 1 } 
          : { opacity: 0, y: -10, scale: 0.95, pointerEvents: 'none' }
        }
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white border border-zinc-200 overflow-hidden z-10"
      >
        <div className="py-1" role="listbox">
          {themeOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => handleThemeSelect(option.value)}
              className={`w-full text-left px-3 py-2 flex items-center gap-2 text-sm ${
                selectedTheme === option.value 
                  ? 'bg-zinc-100 text-zinc-900' 
                  : 'text-zinc-700 hover:bg-zinc-50'
              }`}
              whileHover={{ backgroundColor: selectedTheme === option.value ? '#f4f4f5' : '#fafafa' }}
              role="option"
              aria-selected={selectedTheme === option.value}
            >
              {option.icon}
              {option.label}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default UISwitcher