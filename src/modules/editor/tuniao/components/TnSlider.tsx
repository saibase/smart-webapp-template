import * as React from 'react'

import { cn } from '~/lib/cn'

type TnSliderProps = {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  label?: string
  disabled?: boolean
  className?: string
}

export const TnSlider: React.FC<TnSliderProps> = ({
  value = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text">{label}</label>
          <span className="text-xs text-text-secondary">{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-bg-fill-secondary rounded-lg appearance-none cursor-pointer accent-text disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}
