import * as React from 'react'

import { cn } from '~/lib/cn'

type BsNavbarProps = {
  title?: string
  fixed?: boolean
  bgColor?: string
  className?: string
}

export const BsNavbar: React.FC<BsNavbarProps> = ({
  title,
  fixed = true,
  bgColor,
  className,
}) => {
  return (
    <nav
      className={cn(
        'flex items-center px-4 h-12 bg-bg-fill border-b border-border',
        fixed && 'fixed top-0 left-0 right-0 z-50',
        className,
      )}
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1" />
      {title && <div className="font-medium text-text">{title}</div>}
      <div className="flex-1" />
    </nav>
  )
}
