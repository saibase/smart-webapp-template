import * as React from 'react'

import { cn } from '~/lib/cn'

type BsSearchProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  bgColor?: string
  className?: string
}

export const BsSearch: React.FC<BsSearchProps> = ({
  placeholder = '请输入搜索内容',
  value = '',
  onChange,
  bgColor,
  className,
}) => {
  return (
    <div
      className={cn('relative px-4 py-2', className)}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex items-center bg-bg-fill-secondary rounded-full px-4 py-2">
        <svg
          className="w-4 h-4 text-text-secondary mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="bg-transparent flex-1 outline-none text-sm text-text placeholder:text-text-secondary"
        />
      </div>
    </div>
  )
}
