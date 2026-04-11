import type { CSSProperties } from 'react'
import * as React from 'react'

import { cn } from '~/lib/cn'

type HeadingProps = {
  content: string
  level?: 1 | 2 | 3
  style?: CSSProperties
  className?: string
}

export const Heading: React.FC<HeadingProps> = ({
  content,
  level = 1,
  style,
  className,
}) => {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements
  const sizeClass = {
    1: 'text-3xl',
    2: 'text-2xl',
    3: 'text-xl',
  }[level]

  return (
    <Component
      className={cn('font-bold text-text', sizeClass, className)}
      style={style}
    >
      {content}
    </Component>
  )
}
