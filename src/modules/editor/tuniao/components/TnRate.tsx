import * as React from 'react'

import { cn } from '~/lib/cn'

type TnRateProps = {
  value?: number
  max?: number
  onChange?: (value: number) => void
  readonly?: boolean
  className?: string
}

export const TnRate: React.FC<TnRateProps> = ({
  value = 3,
  max = 5,
  onChange,
  readonly = false,
  className,
}) => {
  const [hoverValue, setHoverValue] = React.useState(0)
  const displayValue = hoverValue || value

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }, (_, i) => {
        const index = i + 1
        const filled = index <= displayValue

        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onMouseEnter={() => !readonly && setHoverValue(index)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange?.(index)}
            className={cn(
              'cursor-pointer transition-transform',
              readonly && 'cursor-default',
              filled ? 'text-amber-400' : 'text-border',
            )}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
