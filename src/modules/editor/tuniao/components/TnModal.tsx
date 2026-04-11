import * as React from 'react'

import { cn } from '~/lib/cn'

type TnModalProps = {
  visible?: boolean
  title?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  className?: string
  children?: React.ReactNode
}

export const TnModal: React.FC<TnModalProps> = ({
  visible = false,
  title = '标题',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  className,
  children,
}) => {
  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div
        className={cn(
          'relative bg-bg-fill rounded-lg shadow-lg w-[90%] max-w-md overflow-hidden',
          className,
        )}
      >
        {title && (
          <div className="px-4 py-3 border-b border-border">
            <div className="font-medium text-text">{title}</div>
          </div>
        )}
        <div className="px-4 py-4">
          {children || (
            <div className="text-text-secondary text-sm">内容区域</div>
          )}
        </div>
        {(onConfirm || onCancel) && (
          <div className="px-4 py-3 border-t border-border flex justify-end gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md border border-border text-text hover:bg-bg-fill-secondary transition-colors"
              >
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-text text-bg-fill hover:opacity-80 transition-colors"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
