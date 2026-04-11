import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnPaginationProps = {
  current: number
  total: number
  pageSize?: number
  onCurrentChange?: (page: number) => void
  className?: string
}

export const TnPagination: React.FC<TnPaginationProps> = ({
  current = 1,
  total = 50,
  pageSize = 10,
  onCurrentChange,
  className,
}) => {
  const totalPages = Math.ceil(total / pageSize)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleClick = (page: number) => {
    if (page === current || page < 1 || page > totalPages) return
    onCurrentChange?.(page)
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <button
        type="button"
        onClick={() => handleClick(current - 1)}
        disabled={current <= 1}
        className="px-3 py-1 rounded border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => handleClick(page)}
          className={cn(
            'px-3 py-1 rounded border min-w-[36px]',
            current === page
              ? 'bg-primary border-primary text-white'
              : 'border-border hover:bg-accent',
          )}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => handleClick(current + 1)}
        disabled={current >= totalPages}
        className="px-3 py-1 rounded border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
  )
}
