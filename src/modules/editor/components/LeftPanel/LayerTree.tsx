import * as React from 'react'
import { useCallback } from 'react'

import type { CanvasElement } from '~/atoms/editor'
import {
  updateElementProps,
  useCanvasElementsValue,
  useExpandedLayerIdsValue,
  useLayerSearchQueryValue,
  useSelectedElementIdsValue,
  useSetExpandedLayerIds,
  useSetSelectedElementIds,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'

// ── 图层类型对应图标 ──────────────────────────────────
const typeIconMap: Record<string, React.ReactNode> = {
  frame: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  group: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  text: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 6.1H3M21 12.1H3M15.1 18H3" />
    </svg>
  ),
  heading: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 12h12M6 4v16M18 4v16" />
    </svg>
  ),
  button: (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="7" width="20" height="10" rx="5" />
    </svg>
  ),
}

const DefaultIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
  </svg>
)

// ── 显隐图标 ────────────────────────────────────────
const EyeIcon = ({ hidden }: { hidden?: boolean }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    {hidden ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
)

// ── 锁定图标 ────────────────────────────────────────
const LockIcon = ({ locked }: { locked?: boolean }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    {locked ? (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ) : (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </>
    )}
  </svg>
)

// ── 展开/折叠箭头 ────────────────────────────────────
const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{
      transition: 'transform 0.15s',
      transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// ── 获取图层显示名称 ─────────────────────────────────
const getLayerName = (el: CanvasElement): string => {
  return (
    el.props?.label ||
    el.props?.content ||
    el.props?.text ||
    el.props?.title ||
    el.type
  )
}

// ── 单个图层节点 ─────────────────────────────────────
type LayerNodeProps = {
  element: CanvasElement
  depth: number
  children?: CanvasElement[]
  allElements: CanvasElement[]
}

const LayerNode: React.FC<LayerNodeProps> = ({
  element,
  depth,
  children = [],
  allElements,
}) => {
  const selectedIds = useSelectedElementIdsValue()
  const setSelectedIds = useSetSelectedElementIds()
  const expandedIds = useExpandedLayerIdsValue()
  const setExpandedIds = useSetExpandedLayerIds()

  const isSelected = selectedIds.includes(element.id)
  const hasChildren = children.length > 0
  const isExpanded = expandedIds.includes(element.id)
  const isHidden = element.props?.visible === false
  const isLocked = element.props?.locked === true

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLocked) return
    if (e.metaKey || e.ctrlKey) {
      // 多选
      if (isSelected) {
        setSelectedIds(selectedIds.filter((id) => id !== element.id))
      } else {
        setSelectedIds([...selectedIds, element.id])
      }
    } else {
      setSelectedIds([element.id])
    }
  }

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!hasChildren) return
    if (isExpanded) {
      setExpandedIds(expandedIds.filter((id) => id !== element.id))
    } else {
      setExpandedIds([...expandedIds, element.id])
    }
  }

  const handleToggleVisible = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateElementProps(element.id, { visible: !isHidden })
  }

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateElementProps(element.id, { locked: !isLocked })
  }

  const TypeIcon = typeIconMap[element.type] ?? <DefaultIcon />
  const layerName = getLayerName(element)
  const indentPx = depth * 12

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 pr-1 py-[3px] rounded cursor-pointer select-none',
          isSelected
            ? 'bg-primary/15 text-primary'
            : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
          isHidden && 'opacity-40',
        )}
        style={{ paddingLeft: `${8 + indentPx}px` }}
        onClick={handleSelect}
      >
        {/* 展开/折叠箭头 */}
        <span
          className={cn(
            'flex-none w-3 flex items-center justify-center',
            !hasChildren && 'opacity-0',
          )}
          onClick={handleToggleExpand}
        >
          <ChevronIcon expanded={isExpanded} />
        </span>

        {/* 类型图标 */}
        <span className="flex-none opacity-60">{TypeIcon}</span>

        {/* 图层名称 */}
        <span className="flex-1 text-xs truncate min-w-0">{layerName}</span>

        {/* 操作按钮（hover 时显示） */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            title={isHidden ? '显示' : '隐藏'}
            onClick={handleToggleVisible}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded hover:bg-fill-tertiary transition-colors',
              isHidden ? 'text-text-tertiary' : 'text-text-secondary',
            )}
          >
            <EyeIcon hidden={isHidden} />
          </button>
          <button
            type="button"
            title={isLocked ? '解锁' : '锁定'}
            onClick={handleToggleLock}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded hover:bg-fill-tertiary transition-colors',
              isLocked ? 'text-primary' : 'text-text-secondary',
            )}
          >
            <LockIcon locked={isLocked} />
          </button>
        </div>
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => {
            const grandChildren = allElements.filter(
              (el) => el.parentId === child.id,
            )
            return (
              <LayerNode
                key={child.id}
                element={child}
                depth={depth + 1}
                children={grandChildren}
                allElements={allElements}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── 图层树主体 ───────────────────────────────────────
export const LayerTree: React.FC = () => {
  const elements = useCanvasElementsValue()
  const searchQuery = useLayerSearchQueryValue()

  // 构建树：根节点（无 parentId）
  const rootElements = elements
    .filter((el) => !el.parentId)
    .sort((a, b) => b.zIndex - a.zIndex) // 按 zIndex 从高到低展示（上层在前）

  // 搜索过滤：扁平化匹配
  const filterElement = useCallback(
    (el: CanvasElement) => {
      if (!searchQuery) return true
      const name = getLayerName(el).toLowerCase()
      const id = el.id.toLowerCase()
      const q = searchQuery.toLowerCase()
      return name.includes(q) || id.includes(q)
    },
    [searchQuery],
  )

  const filteredRoots = searchQuery
    ? elements.filter((el) => !el.parentId && filterElement(el))
    : rootElements

  if (elements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-tertiary">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        <span className="text-xs">画布为空，从资源面板拖入组件</span>
      </div>
    )
  }

  if (searchQuery && filteredRoots.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-xs text-text-tertiary">
        未找到匹配图层
      </div>
    )
  }

  return (
    <div className="py-1">
      {filteredRoots.map((el) => {
        const children = elements.filter((c) => c.parentId === el.id)
        return (
          <LayerNode
            key={el.id}
            element={el}
            depth={0}
            children={children}
            allElements={elements}
          />
        )
      })}
    </div>
  )
}
