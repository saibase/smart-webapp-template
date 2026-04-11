import * as React from 'react'

import { cn } from '~/lib/cn'

type TnTagProps = {
  text?: string
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  closable?: boolean
  onClose?: () => void
  className?: string
}

export const TnTag: React.FC<TnTagProps> = ({
  text = '标签',
  type = 'default',
  size = 'medium',
  closable = false,
  onClose,
  className,
}) => {
  const typeClasses = {
    default: 'bg-bg-fill-secondary text-text',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  }

  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full',
        typeClasses[type],
        sizeClasses[size],
        className,
      )}
    >
      {text}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 -mr-1 hover:opacity-70"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  )
}
