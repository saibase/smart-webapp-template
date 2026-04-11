import * as React from 'react'

import { cn } from '~/lib/cn'

type ButtonProps = {
  text: string
  style?: {
    backgroundColor?: string
    color?: string
    padding?: string
    borderRadius?: string
    fontSize?: string
  }
  className?: string
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({
  text,
  style,
  className,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={cn('px-4 py-2 rounded bg-primary text-white', className)}
      style={style}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
