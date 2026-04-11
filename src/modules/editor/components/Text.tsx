import type { CSSProperties } from 'react'
import * as React from 'react'

import { cn } from '~/lib/cn'

type TextProps = {
  content: string
  style?: CSSProperties
  className?: string
}

export const Text: React.FC<TextProps> = ({ content, style, className }) => {
  return (
    <p className={cn('text-text', className)} style={style}>
      {content}
    </p>
  )
}
