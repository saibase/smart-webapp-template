import * as React from 'react'
import { useState } from 'react'

import { cn } from '~/lib/cn'

export type TnCollapseProps = {
  accordion?: boolean
  title?: string
  visible?: boolean
  className?: string
  children?: React.ReactNode
}

export const TnCollapse: React.FC<TnCollapseProps> = ({
  accordion: _accordion = false,
  title = '折叠面板',
  visible = false,
  className,
  children,
}) => {
  const [expanded, setExpanded] = useState(visible)

  return (
    <div
      className={cn(
        'border border-gray-200 rounded-lg overflow-hidden',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-gray-50 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-text">{title}</span>
        <span
          className={cn(
            'transition-transform duration-200',
            expanded ? 'rotate-180' : 'rotate-0',
          )}
        >
          ▼
        </span>
      </button>
      {expanded && (
        <div className="px-4 py-3 bg-bg-fill">
          {children || (
            <div className="text-text-secondary">折叠面板内容区域</div>
          )}
        </div>
      )}
    </div>
  )
}
