import type { CSSProperties } from 'react'
import * as React from 'react'

import { cn } from '~/lib/cn'

export interface GroupProps {
  label?: string
  width?: number
  height?: number
  style?: CSSProperties
  className?: string
}

export const Group: React.FC<GroupProps> = ({
  label = '组',
  width = 200,
  height = 200,
  style,
  className,
}) => {
  return (
    <div
      className={cn('relative', className)}
      style={{
        width,
        height,
        border: '2px dashed #3b82f6',
        borderRadius: 4,
        backgroundColor: 'transparent',
        minWidth: 50,
        minHeight: 50,
        ...style,
      }}
    >
      {label && (
        <div className="absolute -top-5 left-0 px-2 py-0.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded">
          {label}
        </div>
      )}
    </div>
  )
}
