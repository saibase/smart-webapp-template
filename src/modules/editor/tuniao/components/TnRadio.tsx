import * as React from 'react'

import { cn } from '~/lib/cn'

type TnRadioProps = {
  label?: string
  value?: string
  checked?: boolean
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export const TnRadio: React.FC<TnRadioProps> = ({
  label,
  value = '',
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
          'w-5 h-5 border rounded-full flex items-center justify-center transition-colors',
          checked ? 'border-text bg-text' : 'border-border bg-bg-fill',
        )}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-bg-fill" />}
      </div>
      {label && <span className="text-sm text-text">{label}</span>}
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="sr-only"
      />
    </label>
  )
}
