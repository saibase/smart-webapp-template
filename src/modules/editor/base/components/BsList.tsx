import * as React from 'react'

import { cn } from '~/lib/cn'

type ListItem = {
  title: string
  description?: string
  image?: string
}

type BsListProps = {
  items?: ListItem[]
  divided?: boolean
  className?: string
  onClickItem?: (index: number) => void
}

export const BsList: React.FC<BsListProps> = ({
  items = [
    { title: '列表项1', description: '描述信息' },
    { title: '列表项2', description: '描述信息' },
    { title: '列表项3', description: '描述信息' },
  ],
  divided = true,
  className,
  onClickItem,
}) => {
  return (
    <div className={cn('divide-y divide-border', className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-3 py-3 cursor-pointer hover:bg-bg-fill-secondary transition-colors',
            !divided && 'border-b border-border',
          )}
          onClick={() => onClickItem?.(index)}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 rounded-md object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-text truncate">{item.title}</div>
            {item.description && (
              <div className="text-sm text-text-secondary truncate">
                {item.description}
              </div>
            )}
          </div>
          <svg
            className="w-4 h-4 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
