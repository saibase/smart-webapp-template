import * as React from 'react'

import { cn } from '~/lib/cn'

type SelectOption = {
  label: string
  value: string
}

type BsSelectProps = {
  placeholder?: string
  value?: string
  options?: SelectOption[]
  onChange?: (value: string) => void
  label?: string
  disabled?: boolean
  className?: string
}

export const BsSelect: React.FC<BsSelectProps> = ({
  placeholder = '请选择',
  value = '',
  options = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3' },
  ],
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label className="text-sm font-medium text-text">{label}</label>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="px-3 py-2 rounded-md border border-border bg-bg-fill text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
      >
        {!value && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
