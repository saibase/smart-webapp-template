import * as React from 'react'

import { cn } from '~/lib/cn'

type BsSwitchProps = {
  checked?: boolean
  onChange?: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export const BsSwitch: React.FC<BsSwitchProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-3 cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {label && <span className="text-sm text-text">{label}</span>}
      <div
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
          checked ? 'bg-text' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-bg-fill shadow ring-0 transition duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          )}
        />
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
      </div>
    </label>
  )
}
