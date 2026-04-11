import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnPopupProps = {
  visible?: boolean
  title?: string
  className?: string
  children?: React.ReactNode
}

export const TnPopup: React.FC<TnPopupProps> = ({
  visible = false,
  title = '弹出层',
  className,
  children,
}) => {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div
        className={cn(
          'w-full max-w-md bg-bg-fill rounded-t-xl shadow-lg max-h-[80vh] overflow-y-auto',
          className,
        )}
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-medium text-text">{title}</h3>
          <button type="button" className="text-text-secondary hover:text-text">
            ✕
          </button>
        </div>
        <div className="p-4">
          {children || <div className="text-text-secondary">弹出层内容</div>}
        </div>
      </div>
    </div>
  )
}
