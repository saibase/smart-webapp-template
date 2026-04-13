import * as React from 'react'

import { cn } from '~/lib/cn'

export type BsEmptyProps = {
  image?: string
  description?: string
  className?: string
}

export const BsEmpty: React.FC<BsEmptyProps> = ({
  description = '暂无数据',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4',
        className,
      )}
    >
      <div className="w-24 h-24 mb-4 opacity-40 text-text-secondary">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="10"
            y="10"
            width="80"
            height="70"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="35" cy="35" r="8" fill="currentColor" />
          <path
            d="M20 70 L50 45 L80 65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-text-secondary">{description}</p>
    </div>
  )
}
