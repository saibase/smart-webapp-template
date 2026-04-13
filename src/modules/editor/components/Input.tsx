import * as React from 'react'

import { cn } from '~/lib/cn'

type InputProps = {
  placeholder: string
  style?: {
    backgroundColor?: string
    color?: string
    fontSize?: string
    borderColor?: string
    borderWidth?: string
    borderStyle?: string
    padding?: string
    margin?: string
    borderRadius?: string
    width?: string | number
    height?: string | number
  }
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  style,
  className,
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={cn('px-3 py-2 border border-border rounded bg-bg', className)}
      style={style}
      value={value}
      onChange={onChange}
    />
  )
}
