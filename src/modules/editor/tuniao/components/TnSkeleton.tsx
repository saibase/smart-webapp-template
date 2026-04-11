import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnSkeletonProps = {
  rows?: number
  animated?: boolean
  className?: string
}

export const TnSkeleton: React.FC<TnSkeletonProps> = ({
  rows = 3,
  animated = true,
  className,
}) => {
  const animationClass = animated
    ? 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%]'
    : 'bg-gray-200'

  return (
    <div className={cn('space-y-3', className)}>
      <div className={cn('h-4 w-3/4 rounded', animationClass)} />
      {Array.from({ length: rows - 1 }).map((_, i) => (
        <div key={i} className={cn('h-4 w-full rounded', animationClass)} />
      ))}
      <div className={cn('h-4 w-2/3 rounded', animationClass)} />
    </div>
  )
}
