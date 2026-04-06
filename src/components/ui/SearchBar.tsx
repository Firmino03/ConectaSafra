'use client'
// src/components/ui/SearchBar.tsx
import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'

interface Props {
  placeholder?: string
  onSearch: (value: string) => void
  debounceMs?: number
  className?: string
}

export function SearchBar({ placeholder = 'Pesquisar...', onSearch, debounceMs = 300, className = '' }: Props) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs)
    return () => clearTimeout(timer)
  }, [value, debounceMs, onSearch])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
