import * as React from 'react'

import { cn } from '~/lib/cn'

export type BsStickyProps = {
  offsetTop?: number
  className?: string
  children?: React.ReactNode
}

export const BsSticky: React.FC<BsStickyProps> = ({
  offsetTop = 0,
  className,
  children,
}) => {
  return (
    <div
      className={cn('sticky top-0 z-10 bg-bg-fill', className)}
      style={{ top: offsetTop }}
    >
      {children || (
        <div className="px-4 py-3 border-b border-border">吸顶容器</div>
      )}
    </div>
  )
}
