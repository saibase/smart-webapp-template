import * as React from 'react'

import { cn } from '~/lib/cn'

type BsButtonProps = {
  text?: string
  type?: 'primary' | 'default' | 'outline' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  bgColor?: string
  textColor?: string
  rounded?: number
  className?: string
  onClick?: () => void
}

export const BsButton: React.FC<BsButtonProps> = ({
  text = '按钮',
  type = 'primary',
  size = 'medium',
  disabled = false,
  bgColor,
  textColor,
  rounded = 6,
  className,
  onClick,
}) => {
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  const typeClasses = {
    primary: 'bg-text text-bg-fill',
    default: 'bg-bg-fill border border-border text-text',
    outline: 'border border-text text-text bg-transparent',
    text: 'bg-transparent text-text',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        typeClasses[type],
        className,
      )}
      style={{
        borderRadius: rounded,
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {text}
    </button>
  )
}
