import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnLoadingProps = {
  type?: 'spinner' | 'circular' | 'text'
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
}

export const TnLoading: React.FC<TnLoadingProps> = ({
  type = 'spinner',
  size = 'medium',
  text = '加载中...',
  className,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  }

  if (type === 'text') {
    return <div className={cn('text-text-secondary', className)}>{text}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div
        className={cn(
          'border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin',
          sizeClasses[size],
        )}
      />
      {text && <span className="text-text-secondary">{text}</span>}
    </div>
  )
}
