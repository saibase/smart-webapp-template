/**
 * 图层树
 * - 显示画布元素的树形层级结构
 * - 支持点击选中、双击重命名、显隐、锁定
 * - 支持拖拽改变父子关系（locked 图层不可拖拽也不可作为目标）
 * - 拖拽模式：
 *     前 30% 区域 → 插入为同级（before）
 *     中 40% 区域 → 成为子节点（child）
 *     后 30% 区域 → 插入为同级（after）
 */
import * as React from 'react'
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { CanvasElement } from '~/atoms/editor'
import {
  renameLayer,
  reparentElement,
  updateElementProps,
  useCanvasElementsValue,
  useExpandedLayerIdsValue,
  useLayerSearchQueryValue,
  useRenamingLayerIdValue,
  useSelectedElementIdsValue,
  useSelectedElementsValue,
  useSetExpandedLayerIds,
  useSetRenamingLayerId,
  useSetSelectedElementIds,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'

import { LayerContextMenu } from './LayerContextMenu'

// ─────────────────────────────────────────────────────────
// 图标
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
// 获取图层显示名
// ─────────────────────────────────────────────────────────
const getLayerName = (el: CanvasElement) =>
  el.props?.label ||
  el.props?.content ||
  el.props?.text ||
  el.props?.title ||
  el.type

// ─────────────────────────────────────────────────────────
// 拖拽上下文
// ─────────────────────────────────────────────────────────
type DropPosition = 'before' | 'child' | 'after'

type DragContextType = {
  /** 当前被拖拽的图层 id */
  draggedId: string | null
  /** 悬停目标 */
  dropInfo: { id: string; position: DropPosition } | null
  onDragStart: (id: string, locked: boolean) => void
  onDragEnd: () => void
  onDragOver: (e: React.DragEvent, id: string, locked: boolean) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, targetId: string, targetLocked: boolean) => void
}

const DragContext = createContext<DragContextType>({
  draggedId: null,
  dropInfo: null,
  onDragStart: () => {},
  onDragEnd: () => {},
  onDragOver: () => {},
  onDragLeave: () => {},
  onDrop: () => {},
})

// ─────────────────────────────────────────────────────────
// 计算悬停区域位置（前/子/后）
// ─────────────────────────────────────────────────────────
const calcDropPosition = (e: React.DragEvent): DropPosition => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const relY = e.clientY - rect.top
  const ratio = relY / rect.height
  if (ratio < 0.3) return 'before'
  if (ratio > 0.7) return 'after'
  return 'child'
}

// ─────────────────────────────────────────────────────────
// 单个图层节点
// ─────────────────────────────────────────────────────────
type LayerNodeProps = {
  element: CanvasElement
  depth: number
  childElements: CanvasElement[]
  allElements: CanvasElement[]
  onContextMenu: (state: {
    x: number
    y: number
    element: CanvasElement
  }) => void
}

const LayerNode: React.FC<LayerNodeProps> = ({
  element,
  depth,
  childElements,
  allElements,
  onContextMenu,
}) => {
  const selectedIds = useSelectedElementIdsValue()
  const setSelectedIds = useSetSelectedElementIds()
  const expandedIds = useExpandedLayerIdsValue()
  const setExpandedIds = useSetExpandedLayerIds()
  const renamingId = useRenamingLayerIdValue()
  const setRenamingId = useSetRenamingLayerId()
  const drag = use(DragContext)

  const renameInputRef = useRef<HTMLInputElement>(null)
  const [renameValue, setRenameValue] = useState('')

  const isSelected = selectedIds.includes(element.id)
  const hasChildren = childElements.length > 0
  const isExpanded = expandedIds.includes(element.id)
  const isHidden = element.props?.visible === false
  const isLocked = element.props?.locked === true
  const isRenaming = renamingId === element.id
  const isDragging = drag.draggedId === element.id

  // 是当前悬停目标
  const dropInfo = drag.dropInfo?.id === element.id ? drag.dropInfo : null

  // 进入重命名时聚焦
  React.useEffect(() => {
    if (isRenaming) {
      setRenameValue(getLayerName(element))
      const t = setTimeout(() => renameInputRef.current?.select(), 0)
      return () => clearTimeout(t)
    }
  }, [isRenaming, element])

  const commitRename = () => {
    if (renameValue.trim()) renameLayer(element.id, renameValue.trim())
    setRenamingId(null)
  }

  // ── 点击选中 ──
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isRenaming) return
    if (e.metaKey || e.ctrlKey) {
      setSelectedIds(
        isSelected
          ? selectedIds.filter((id) => id !== element.id)
          : [...selectedIds, element.id],
      )
    } else {
      setSelectedIds([element.id])
    }
  }

  // ── 双击重命名 ──
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingId(element.id)
  }

  // ── 展开/折叠 ──
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!hasChildren) return
    setExpandedIds(
      isExpanded
        ? expandedIds.filter((id) => id !== element.id)
        : [...expandedIds, element.id],
    )
  }

  // ── 显隐 ──（isHidden=false 时隐藏，isHidden=true 时显示）
  const handleToggleVisible = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateElementProps(element.id, { visible: isHidden ? true : false })
  }

  // ── 锁定 ──
  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateElementProps(element.id, { locked: !isLocked })
  }

  // ── 右键菜单 ──
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isSelected) setSelectedIds([element.id])
    onContextMenu({ x: e.clientX, y: e.clientY, element })
  }

  const TypeIcon = typeIconMap[element.type] ?? <DefaultIcon />
  const indentPx = 8 + depth * 12

  return (
    <div className={cn(isDragging && 'opacity-40')}>
      {/* 前插入线 */}
      {dropInfo?.position === 'before' && (
        <div className="h-0.5 bg-primary mx-2 rounded-full" />
      )}

      <div
        draggable={!isLocked}
        onDragStart={() => drag.onDragStart(element.id, isLocked)}
        onDragEnd={drag.onDragEnd}
        onDragOver={(e) => drag.onDragOver(e, element.id, isLocked)}
        onDragLeave={drag.onDragLeave}
        onDrop={(e) => drag.onDrop(e, element.id, isLocked)}
        className={cn(
          'group/node flex items-center gap-1 pr-1 py-[3px] rounded cursor-pointer select-none',
          isSelected
            ? 'bg-primary/15 text-primary'
            : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
          isHidden && !isSelected && 'opacity-40',
          // 子节点拖入高亮
          dropInfo?.position === 'child' &&
            'ring-2 ring-inset ring-primary bg-primary/10 !text-primary',
        )}
        style={{ paddingLeft: `${indentPx}px` }}
        onClick={handleSelect}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        {/* 展开箭头 */}
        <span
          className={cn(
            'flex-none w-3 flex items-center justify-center',
            !hasChildren && 'opacity-0 pointer-events-none',
          )}
          onClick={handleToggleExpand}
        >
          <ChevronIcon expanded={isExpanded} />
        </span>

        {/* 类型图标 */}
        <span className="flex-none opacity-60">{TypeIcon}</span>

        {/* 图层名 / 内联重命名 */}
        {isRenaming ? (
          <input
            ref={renameInputRef}
            className="flex-1 min-w-0 text-xs bg-bg-fill border border-primary rounded px-1 outline-none text-text"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRename()
              if (e.key === 'Escape') setRenamingId(null)
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="flex-1 text-xs truncate min-w-0">
            {getLayerName(element)}
          </span>
        )}

        {/* 状态按钮：激活态始终显示，否则 hover 显示 */}
        <div
          className={cn(
            'flex items-center gap-0.5 transition-opacity shrink-0',
            isHidden || isLocked
              ? 'opacity-100'
              : 'opacity-0 group-hover/node:opacity-100',
          )}
        >
          <button
            type="button"
            title={
              isHidden ? '显示图层（Shift+Cmd+H）' : '隐藏图层（Shift+Cmd+H）'
            }
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
            title={
              isLocked ? '解锁图层（Shift+Cmd+L）' : '锁定图层（Shift+Cmd+L）'
            }
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

      {/* 后插入线 */}
      {dropInfo?.position === 'after' && (
        <div className="h-0.5 bg-primary mx-2 rounded-full" />
      )}

      {/* 子节点递归 */}
      {hasChildren && isExpanded && (
        <div>
          {childElements.map((child) => (
            <LayerNode
              key={child.id}
              element={child}
              depth={depth + 1}
              childElements={allElements.filter(
                (el) => el.parentId === child.id,
              )}
              allElements={allElements}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// 图层树根组件
// ─────────────────────────────────────────────────────────
export const LayerTree: React.FC = () => {
  const elements = useCanvasElementsValue()
  const searchQuery = useLayerSearchQueryValue()
  const selectedElements = useSelectedElementsValue()

  const [ctxMenu, setCtxMenu] = useState<{
    x: number
    y: number
    element: CanvasElement
  } | null>(null)

  // ── 拖拽状态 ──
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropInfo, setDropInfo] = useState<{
    id: string
    position: DropPosition
  } | null>(null)

  const onDragStart = useCallback((id: string, locked: boolean) => {
    if (locked) return
    setDraggedId(id)
  }, [])

  const onDragEnd = useCallback(() => {
    setDraggedId(null)
    setDropInfo(null)
  }, [])

  const onDragOver = useCallback(
    (e: React.DragEvent, id: string, locked: boolean) => {
      e.preventDefault()
      e.stopPropagation()
      // 目标锁定 → 拒绝，显示禁止光标
      if (locked || id === draggedId) {
        e.dataTransfer.dropEffect = 'none'
        setDropInfo(null)
        return
      }
      e.dataTransfer.dropEffect = 'move'
      const position = calcDropPosition(e)
      setDropInfo({ id, position })
    },
    [draggedId],
  )

  const onDragLeave = useCallback(() => {
    setDropInfo(null)
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent, targetId: string, targetLocked: boolean) => {
      e.preventDefault()
      e.stopPropagation()
      if (!draggedId || targetLocked || draggedId === targetId) {
        setDraggedId(null)
        setDropInfo(null)
        return
      }
      const position = dropInfo?.position ?? 'child'
      reparentElement(draggedId, targetId, position)
      setDraggedId(null)
      setDropInfo(null)
    },
    [draggedId, dropInfo],
  )

  const dragCtx: DragContextType = useMemo(
    () => ({
      draggedId,
      dropInfo,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragLeave,
      onDrop,
    }),
    [
      draggedId,
      dropInfo,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragLeave,
      onDrop,
    ],
  )

  // ── 树形数据 ──
  const rootElements = elements
    .filter((el) => !el.parentId)
    .sort((a, b) => b.zIndex - a.zIndex)

  const filterEl = useCallback(
    (el: CanvasElement) => {
      if (!searchQuery) return true
      const name = getLayerName(el).toLowerCase()
      return (
        name.includes(searchQuery.toLowerCase()) ||
        el.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    },
    [searchQuery],
  )

  const filteredRoots = searchQuery
    ? rootElements.filter((el) => filterEl(el))
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
    <DragContext value={dragCtx}>
      <div className="py-1">
        {filteredRoots.map((el) => (
          <LayerNode
            key={el.id}
            element={el}
            depth={0}
            childElements={elements.filter((c) => c.parentId === el.id)}
            allElements={elements}
            onContextMenu={setCtxMenu}
          />
        ))}
      </div>

      {ctxMenu && (
        <LayerContextMenu
          x={ctxMenu.x}
          y={ctxMenu.y}
          targetElement={ctxMenu.element}
          selectedElements={
            selectedElements.length > 0 ? selectedElements : [ctxMenu.element]
          }
          onClose={() => setCtxMenu(null)}
        />
      )}
    </DragContext>
  )
}
