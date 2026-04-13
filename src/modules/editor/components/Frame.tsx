import type { CSSProperties } from 'react'
import * as React from 'react'

import { cn } from '~/lib/cn'

type FrameProps = {
  width?: number
  height?: number
  backgroundColor?: string
  padding?: number
  style?: CSSProperties
  className?: string
  children?: React.ReactNode
}

export const Frame: React.FC<FrameProps> = ({
  width = 375,
  height = 667,
  backgroundColor = '#ffffff',
  padding = 0,
  style,
  className,
  children,
}) => {
  const combinedStyle = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor,
    padding: padding ? `${padding}px` : 0,
    ...style,
  }
  return (
    <div
      className={cn(
        'border border-border shadow-lg relative bg-white',
        className,
      )}
      style={combinedStyle}
    >
      {children}
    </div>
  )
}
