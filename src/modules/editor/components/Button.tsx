import * as React from 'react'

import { cn } from '~/lib/cn'

type ButtonProps = {
  text: string
  style?: {
    backgroundColor?: string
    color?: string
    fontSize?: string
    padding?: string
    margin?: string
    borderRadius?: string
    borderColor?: string
    borderWidth?: string
    borderStyle?: string
    width?: string | number
    height?: string | number
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
