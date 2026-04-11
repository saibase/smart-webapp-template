import * as React from 'react'

import { useEditorConfig, useToolMode } from '~/atoms/editor'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip/Tooltip'
import { cn } from '~/lib/cn'

type DeviceToolbarProps = {
  className?: string
}

export const DeviceToolbar: React.FC<DeviceToolbarProps> = ({ className }) => {
  const [{ scale }, setEditorConfig] = useEditorConfig()
  const [toolMode, setToolMode] = useToolMode()

  const changeScale = (delta: number) => {
    setEditorConfig((prev) => ({
      ...prev,
      scale: Math.max(50, Math.min(200, prev.scale + delta)),
    }))
  }

  const tools = [
    {
      id: 'select' as const,
      icon: '👆',
      label: '选择',
      shortcut: 'V',
      description: '选择并编辑元素',
    },
    {
      id: 'pan' as const,
      icon: '👋',
      label: '平移',
      shortcut: 'H',
      description: '拖拽平移画布',
    },
  ] as const

  return (
    <div
      className={cn(
        'absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-bg-fill border border-border rounded-lg shadow-lg p-1 z-[60]',
        className,
      )}
    >
      {/* 工具切换 */}
      {tools.map((tool) => (
        <Tooltip key={tool.id}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setToolMode(tool.id)}
              className={cn(
                'size-7 flex items-center justify-center rounded-md transition-all text-xs font-medium',
                toolMode === tool.id
                  ? 'bg-text text-bg-fill shadow-sm'
                  : 'text-placeholder-text hover:text-text',
              )}
            >
              <span className="text-base">{tool.icon}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="text-center">
              <div className="font-medium">
                {tool.label} ({tool.shortcut})
              </div>
              <div className="text-xs text-text-secondary">
                {tool.description}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}

      <div className="h-6 w-px bg-border mx-1" />

      {/* 缩放控制 */}
      <button
        type="button"
        onClick={() => changeScale(-10)}
        className={cn(
          'size-7 flex items-center justify-center rounded-md transition-all text-xs font-medium',
          'text-placeholder-text hover:text-text',
        )}
      >
        −
      </button>
      <span className="text-sm font-medium min-w-[3rem] text-center">
        {scale}%
      </span>
      <button
        type="button"
        onClick={() => changeScale(10)}
        className={cn(
          'size-7 flex items-center justify-center rounded-md transition-all text-xs font-medium',
          'text-placeholder-text hover:text-text',
        )}
      >
        +
      </button>
    </div>
  )
}
