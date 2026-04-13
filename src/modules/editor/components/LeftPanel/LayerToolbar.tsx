import * as React from 'react'

import {
  addCanvasElement,
  getCanvasElements,
  useLayerSearchVisibleValue,
  useSetExpandedLayerIds,
  useSetLayerSearchVisible,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'

// ── 内联 SVG 图标 ──────────────────────────────────────
const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const ListIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
)

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const CollapseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="10" y1="14" x2="21" y2="3" />
    <line x1="3" y1="21" x2="14" y2="10" />
  </svg>
)
// ──────────────────────────────────────────────────────

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  active,
  title,
  children,
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={cn(
      'flex items-center justify-center w-7 h-7 rounded transition-colors',
      active
        ? 'text-primary bg-primary/10'
        : 'text-text-secondary hover:text-text hover:bg-fill-secondary',
    )}
  >
    {children}
  </button>
)

export const LayerToolbar: React.FC = () => {
  const searchVisible = useLayerSearchVisibleValue()
  const setSearchVisible = useSetLayerSearchVisible()
  const setExpandedIds = useSetExpandedLayerIds()

  // 新增一个空的 group 图层
  const handleAddLayer = () => {
    const elements = getCanvasElements()
    addCanvasElement({
      id: `layer-${Date.now()}`,
      type: 'group',
      props: {
        label: `图层 ${elements.length + 1}`,
        width: 200,
        height: 200,
        style: {
          width: 200,
          height: 200,
          border: '2px dashed #3b82f6',
          backgroundColor: 'transparent',
        },
      },
      position: { x: 100, y: 100 },
      zIndex: elements.length,
    })
  }

  // 全部折叠：清空展开列表
  const handleCollapseAll = () => {
    setExpandedIds([])
  }

  return (
    <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
      <span className="text-xs font-medium text-text-secondary pl-1">图层</span>
      <div className="flex items-center gap-0.5">
        <ToolbarButton
          title="搜索图层"
          active={searchVisible}
          onClick={() => setSearchVisible(!searchVisible)}
        >
          <SearchIcon />
        </ToolbarButton>
        <ToolbarButton title="列表视图" onClick={() => {}}>
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton title="新增图层" onClick={handleAddLayer}>
          <PlusIcon />
        </ToolbarButton>
        <ToolbarButton title="全部折叠" onClick={handleCollapseAll}>
          <CollapseIcon />
        </ToolbarButton>
      </div>
    </div>
  )
}
