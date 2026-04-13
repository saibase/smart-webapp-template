/**
 * 顶部全局操作栏（双行）
 * 上行：[Logo] ─── 居中[设计|原型|标注][缩放] ─── [分享][▶][AI][头像]
 * 下行：居中 13 个工具按钮
 */
import * as React from 'react'

import type { EditorWorkflow, ToolMode } from '~/atoms/editor'
import { useEditorConfig, useEditorWorkflow, useToolMode } from '~/atoms/editor'
import { cn } from '~/lib/cn'

// ─────────────────────────────────────────────────────────
// 工具定义
// ─────────────────────────────────────────────────────────
type ToolDef =
  | { type: 'sep' }
  | { type: 'tool'; id: ToolMode; label: string; shortcut?: string }
  | { type: 'action'; id: string; label: string }

const TOOLS: ToolDef[] = [
  { type: 'tool', id: 'select', label: '选择工具', shortcut: 'V' },
  { type: 'tool', id: 'pan', label: '平移', shortcut: 'H' },
  { type: 'sep' },
  { type: 'tool', id: 'rect', label: '矩形', shortcut: 'R' },
  { type: 'tool', id: 'text', label: '文本', shortcut: 'T' },
  { type: 'tool', id: 'pen', label: '钢笔', shortcut: 'P' },
  { type: 'tool', id: 'ellipse', label: '椭圆', shortcut: 'O' },
  { type: 'tool', id: 'mask', label: '蒙版', shortcut: 'M' },
  { type: 'sep' },
  { type: 'action', id: 'component', label: '组件' },
  { type: 'action', id: 'brush', label: '画笔' },
  { type: 'action', id: 'connect', label: '连线' },
  { type: 'action', id: 'ai', label: 'AI 设计' },
]

const WORKFLOW_TABS: { key: EditorWorkflow; label: string }[] = [
  { key: 'design', label: '设计' },
  { key: 'prototype', label: '原型' },
  { key: 'annotation', label: '标注' },
]

// ─────────────────────────────────────────────────────────
// 工具图标（内联 SVG）
// ─────────────────────────────────────────────────────────
const ToolIcon: React.FC<{ id: string }> = ({ id }) => {
  const props = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (id) {
    case 'select': {
      return (
        <svg {...props} fill="currentColor" stroke="none">
          <path d="M4 2l16 10-8 1.5-4 8.5z" />
        </svg>
      )
    }
    case 'pan': {
      return (
        <svg {...props}>
          <path d="M18 11V8a2 2 0 0 0-4 0v3M14 11V6a2 2 0 0 0-4 0v5M10 11V8a2 2 0 0 0-4 0v8a6 6 0 0 0 12 0v-5a2 2 0 0 0-4 0" />
        </svg>
      )
    }
    case 'rect': {
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      )
    }
    case 'text': {
      return (
        <svg {...props}>
          <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
      )
    }
    case 'pen': {
      return (
        <svg {...props}>
          <path d="m12 19 7-7 3 3-7 7-3-3z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18z" />
          <path d="m2 2 7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      )
    }
    case 'ellipse': {
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
    }
    case 'mask': {
      return (
        <svg {...props}>
          <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    }
    case 'component': {
      return (
        <svg {...props}>
          <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    }
    case 'brush': {
      return (
        <svg {...props}>
          <path d="M18 3a3 3 0 0 0-3 3l-7 7c-1.5-1-3.5-.5-4.5 1a3.5 3.5 0 0 0 5 5c1.5-1 2-3 1-4.5l7-7a3 3 0 0 0 1.5 0z" />
          <path d="M6 21a1 1 0 0 0 1-1c0-.5-.5-1-.5-1s-.5.5-.5 1a1 1 0 0 0 0 1z" />
        </svg>
      )
    }
    case 'connect': {
      return (
        <svg {...props}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )
    }
    case 'ai': {
      return (
        <svg {...props}>
          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 1 1 0 2h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1 0-2h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z" />
        </svg>
      )
    }
    default: {
      return null
    }
  }
}

// ─────────────────────────────────────────────────────────
// TopBar（单行）h-11 = 44px
// ─────────────────────────────────────────────────────────
export const TOP_BAR_HEIGHT = 44

export const TopBar: React.FC = () => {
  const [toolMode, setToolMode] = useToolMode()
  const [workflow, setWorkflow] = useEditorWorkflow()
  const [{ scale }, setConfig] = useEditorConfig()

  const changeScale = (delta: number) =>
    setConfig((prev) => ({
      ...prev,
      scale: Math.max(25, Math.min(400, prev.scale + delta)),
    }))

  return (
    <header className="fixed top-0 left-0 right-0 h-11 z-[70] flex items-center bg-bg-fill border-b border-border select-none shrink-0 relative">
      {/* ── Logo ──────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 shrink-0 border-r border-border h-full">
        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinejoin="round"
          >
            <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-text hidden lg:block">
          SmartUi
        </span>
      </div>

      {/* ── 13 个工具按钮（绝对居中）── */}
      <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 flex items-center gap-0.5">
        {TOOLS.map((tool, i) => {
          if (tool.type === 'sep') {
            return (
              <div key={`sep-${i}`} className="w-px h-4 bg-border mx-0.5" />
            )
          }
          const isActive = tool.type === 'tool' && toolMode === tool.id
          const label =
            tool.label +
            (tool.type === 'tool' && tool.shortcut
              ? `（${tool.shortcut}）`
              : '')
          return (
            <button
              key={`${tool.id}-${i}`}
              type="button"
              title={label}
              onClick={() => tool.type === 'tool' && setToolMode(tool.id)}
              className={cn(
                'flex items-center justify-center w-7 h-7 rounded transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
              )}
            >
              <ToolIcon id={tool.id} />
            </button>
          )
        })}
      </div>

      {/* ── 弹性占位 ──────────────────────────── */}
      <div className="flex-1" />

      {/* ── 工作流标签 + 缩放（距右边缘 20%）── */}
      <div className="absolute right-[20%] inset-y-0 flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-border overflow-hidden">
          {WORKFLOW_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setWorkflow(tab.key)}
              className={cn(
                'px-3 h-7 text-xs font-medium transition-colors',
                workflow === tab.key
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => changeScale(-10)}
            className="w-6 h-6 flex items-center justify-center rounded text-text-secondary hover:bg-fill-secondary transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="text-xs font-medium text-text w-10 text-center tabular-nums">
            {scale}%
          </span>
          <button
            type="button"
            onClick={() => changeScale(10)}
            className="w-6 h-6 flex items-center justify-center rounded text-text-secondary hover:bg-fill-secondary transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* ── 全局操作 ──────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 shrink-0">
        <button
          type="button"
          className="flex items-center gap-1 px-2.5 h-7 text-xs text-text-secondary border border-border rounded-md hover:bg-fill-secondary transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
          分享
        </button>
        <button
          type="button"
          title="原型预览"
          className="flex items-center justify-center w-7 h-7 rounded-md text-text-secondary hover:bg-fill-secondary transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        </button>
        <button
          type="button"
          title="AI 辅助设计"
          className="w-7 h-7 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-[10px] font-bold"
        >
          AI
        </button>
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
          U
        </div>
      </div>
    </header>
  )
}
