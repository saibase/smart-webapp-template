import * as React from 'react'

import { cn } from '~/lib/cn'

export type TnDrawerProps = {
  visible: boolean
  title?: string
  position?: 'left' | 'right' | 'bottom'
  onClose?: () => void
  className?: string
  children?: React.ReactNode
}

export const TnDrawer: React.FC<TnDrawerProps> = ({
  visible = false,
  title = '标题',
  position = 'bottom',
  onClose,
  className,
  children,
}) => {
  if (!visible) return null

  const positionClasses = {
    left: 'left-0 top-0 h-full w-80 translate-x-0',
    right: 'right-0 top-0 h-full w-80 translate-x-0',
    bottom: 'bottom-0 left-0 right-0 h-auto translate-y-0',
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div
        className={cn(
          'fixed bg-bg-fill z-50 transition-transform duration-300',
          positionClasses[position],
          className,
        )}
      >
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-medium text-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text"
          >
            ✕
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children || <div className="text-text-secondary">抽屉内容区域</div>}
        </div>
      </div>
    </>
  )
}
