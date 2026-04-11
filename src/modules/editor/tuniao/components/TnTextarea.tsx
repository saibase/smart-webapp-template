import * as React from 'react'

import { cn } from '~/lib/cn'

type TnTextareaProps = {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  label?: string
  rows?: number
  disabled?: boolean
  required?: boolean
  className?: string
}

export const TnTextarea: React.FC<TnTextareaProps> = ({
  placeholder = '请输入',
  value = '',
  onChange,
  label,
  rows = 4,
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
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        required={required}
        rows={rows}
        className="px-3 py-2 rounded-md border border-border bg-bg-fill text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 resize-vertical min-h-[80px]"
      />
    </div>
  )
}
