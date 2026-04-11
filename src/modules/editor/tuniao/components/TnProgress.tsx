import * as React from 'react'

import { cn } from '~/lib/cn'

type TnProgressProps = {
  percent?: number
  showText?: boolean
  strokeWidth?: number
  color?: string
  className?: string
}

export const TnProgress: React.FC<TnProgressProps> = ({
  percent = 50,
  showText = true,
  strokeWidth = 8,
  color,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 bg-bg-fill-secondary rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 bg-text"
          style={{
            width: `${Math.min(100, Math.max(0, percent))}%`,
            height: strokeWidth,
            backgroundColor: color,
          }}
        />
      </div>
      {showText && (
        <span className="text-sm text-text-secondary">{percent}%</span>
      )}
    </div>
  )
}
