import * as React from 'react'

import { cn } from '~/lib/cn'

export type BsToastProps = {
  visible?: boolean
  message: string
  duration?: number
  position?: 'top' | 'middle' | 'bottom'
  className?: string
}

export const BsToast: React.FC<BsToastProps> = ({
  visible = true,
  message = '这是一条提示消息',
  position = 'middle',
  className,
}) => {
  if (!visible) return null

  const positionClasses = {
    top: 'top-10',
    middle: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-10',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={cn(
          'fixed px-4 py-2 bg-black/70 text-white rounded-lg max-w-[70vw] text-center',
          positionClasses[position],
          className,
        )}
      >
        {message}
      </div>
    </div>
  )
}
