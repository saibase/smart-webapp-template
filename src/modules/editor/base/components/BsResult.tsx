import * as React from 'react'

import { Button } from '~/components/ui/button/Button'
import { cn } from '~/lib/cn'

export type BsResultProps = {
  status?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  description?: string
  className?: string
}

export const BsResult: React.FC<BsResultProps> = ({
  status = 'success',
  title = '操作成功',
  description = '内容提交成功，我们会尽快处理',
  className,
}) => {
  const statusColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
  }

  const icons = {
    success: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    info: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
      </svg>
    ),
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center py-12 px-4',
        className,
      )}
    >
      <div className={cn('w-16 h-16 mb-6', statusColors[status])}>
        {icons[status]}
      </div>
      <h2 className="text-xl font-semibold text-text mb-2">{title}</h2>
      {description && (
        <p className="text-text-secondary max-w-md mb-6">{description}</p>
      )}
      <div className="flex space-x-3">
        <Button variant="primary">返回首页</Button>
        <Button variant="secondary">重新操作</Button>
      </div>
    </div>
  )
}
