import * as React from 'react'

import { cn } from '~/lib/cn'

type BsDividerProps = {
  direction?: 'horizontal' | 'vertical'
  text?: string
  className?: string
}

export const BsDivider: React.FC<BsDividerProps> = ({
  direction = 'horizontal',
  text,
  className,
}) => {
  if (direction === 'vertical') {
    return <div className={cn('w-px bg-border h-full', className)} />
  }

  if (!text) {
    return <div className={cn('w-full h-px bg-border', className)} />
  }

  return (
    <div className={cn('flex items-center w-full', className)}>
      <div className="flex-1 h-px bg-border" />
      <span className="px-4 text-sm text-text-secondary">{text}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}
