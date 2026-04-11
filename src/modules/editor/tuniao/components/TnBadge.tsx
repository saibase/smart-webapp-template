import * as React from 'react'

import { cn } from '~/lib/cn'

type TnBadgeProps = {
  text?: string | number
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  dot?: boolean
  className?: string
  children?: React.ReactNode
}

export const TnBadge: React.FC<TnBadgeProps> = ({
  text,
  type = 'default',
  dot = false,
  className,
  children,
}) => {
  const typeClasses = {
    default: 'bg-bg-fill-secondary text-text',
    primary: 'bg-primary text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-red-500 text-white',
  }

  if (dot) {
    return (
      <div className="relative inline-block">
        {children}
        <span
          className={cn(
            'absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full',
            typeClasses[type],
            className,
          )}
        />
      </div>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded',
        typeClasses[type],
        className,
      )}
    >
      {text}
    </span>
  )
}
