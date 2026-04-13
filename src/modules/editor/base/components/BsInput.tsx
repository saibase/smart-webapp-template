import * as React from 'react'

import { cn } from '~/lib/cn'

type BsInputProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  label?: string
  type?: 'text' | 'number' | 'password' | 'tel' | 'email'
  disabled?: boolean
  required?: boolean
  className?: string
}

export const BsInput: React.FC<BsInputProps> = ({
  placeholder = '请输入',
  value = '',
  onChange,
  label,
  type = 'text',
  disabled = false,
  required = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-text">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        className="px-3 py-2 rounded-md border border-border bg-bg-fill text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
      />
    </div>
  )
}
