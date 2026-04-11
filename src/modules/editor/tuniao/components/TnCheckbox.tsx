import * as React from 'react'

import { cn } from '~/lib/cn'

type TnCheckboxProps = {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const TnCheckbox: React.FC<TnCheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className,
}) => {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      <div
        className={cn(
          'w-5 h-5 border rounded flex items-center justify-center transition-colors',
          checked
            ? 'bg-text border-text text-bg-fill'
            : 'border-border bg-bg-fill',
        )}
      >
        {checked && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </div>
      {label && <span className="text-sm text-text">{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  )
}
