import * as React from 'react'

import { cn } from '~/lib/cn'

type GridItem = {
  title: string
  image?: string
  description?: string
}

type BsGridListProps = {
  items?: GridItem[]
  columns?: 2 | 3 | 4
  gap?: number
  className?: string
}

export const BsGridList: React.FC<BsGridListProps> = ({
  items = [
    { title: '分类1', image: 'https://picsum.photos/200/200?random=1' },
    { title: '分类2', image: 'https://picsum.photos/200/200?random=2' },
    { title: '分类3', image: 'https://picsum.photos/200/200?random=3' },
    { title: '分类4', image: 'https://picsum.photos/200/200?random=4' },
  ],
  columns = 2,
  gap = 8,
  className,
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn('grid', gridCols[columns], className)} style={{ gap }}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center cursor-pointer"
        >
          {item.image && (
            <div className="mb-2 overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-full aspect-square object-cover"
              />
            </div>
          )}
          <div className="font-medium text-sm text-text">{item.title}</div>
          {item.description && (
            <div className="text-xs text-text-secondary mt-1">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
