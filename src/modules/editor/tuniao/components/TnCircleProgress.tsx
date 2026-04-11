import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnCircleProgressProps = {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  showText?: boolean
  className?: string
}

export const TnCircleProgress: React.FC<TnCircleProgressProps> = ({
  value = 50,
  max = 100,
  size = 120,
  strokeWidth = 6,
  color = '#1989fa',
  showText = true,
  className,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(value / max, 1)
  const strokeDashoffset = circumference * (1 - percent)

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        className,
      )}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#ebedf0"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-medium text-text">
            {Math.round(percent * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}
