import * as React from 'react'

import { cn } from '~/lib/cn'

type TnCardProps = {
  title?: string
  description?: string
  image?: string
  rounded?: number
  padding?: number
  className?: string
  children?: React.ReactNode
}

export const TnCard: React.FC<TnCardProps> = ({
  title,
  description,
  image,
  rounded = 8,
  padding = 16,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        'bg-bg-fill border border-border overflow-hidden',
        className,
      )}
      style={{ borderRadius: rounded, padding: image ? 0 : padding }}
    >
      {image && (
        <div className="overflow-hidden">
          <img src={image} alt={title} className="w-full object-cover" />
        </div>
      )}
      {title && (
        <div className={cn('font-medium text-text', image ? 'p-4' : 'mb-2')}>
          {title}
        </div>
      )}
      {description && (
        <div
          className={cn(
            'text-sm text-text-secondary',
            image ? 'px-4 pb-4' : 'mb-2',
          )}
        >
          {description}
        </div>
      )}
      {children}
    </div>
  )
}
