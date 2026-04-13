import * as React from 'react'
import { useEffect, useRef } from 'react'

import type { CanvasElement } from '~/atoms/editor'
import {
  alignSelectedToInteger,
  changeSelectedElementsZIndex,
  deleteSelectedElements,
  duplicateSelectedElements,
  flipSelectedElements,
  groupSelectedElements,
  setRenamingLayerId,
  toggleSelectedElementsLock,
  toggleSelectedElementsVisibility,
  ungroupElements,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'

// ── 菜单分隔线 ───────────────────────────────────────
const Divider = () => <div className="my-1 border-t border-border" />

// ── 菜单项 ───────────────────────────────────────────
type MenuItemProps = {
  label: string
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({
  label,
  shortcut,
  danger,
  disabled,
  onClick,
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'w-full flex items-center justify-between px-3 py-[5px] text-xs transition-colors text-left',
      danger ? 'text-red hover:bg-red/10' : 'text-text hover:bg-fill-secondary',
      disabled && 'opacity-40 cursor-not-allowed',
    )}
  >
    <span>{label}</span>
    {shortcut && (
      <span className="ml-4 text-[10px] text-text-tertiary font-mono">
        {shortcut}
      </span>
    )}
  </button>
)

// ── 菜单子标题 ───────────────────────────────────────
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="px-3 pt-1.5 pb-0.5 text-[10px] font-medium text-text-tertiary uppercase tracking-wider">
    {label}
  </div>
)

// ── Props ────────────────────────────────────────────
export type LayerContextMenuProps = {
  x: number
  y: number
  targetElement: CanvasElement
  selectedElements: CanvasElement[]
  onClose: () => void
}

export const LayerContextMenu: React.FC<LayerContextMenuProps> = ({
  x,
  y,
  targetElement,
  selectedElements,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isMulti = selectedElements.length > 1
  const isGroup = targetElement.type === 'group'
  const isHidden = targetElement.props?.visible === false
  const isLocked = targetElement.props?.locked === true

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // 延迟一帧注册，避免触发当前右键事件
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [onClose])

  // 菜单边界保护：避免超出视口
  const menuWidth = 220
  const menuHeight = 480
  const safeX = Math.min(x, window.innerWidth - menuWidth - 8)
  const safeY = Math.min(y, window.innerHeight - menuHeight - 8)

  const run = (fn: () => void) => {
    fn()
    onClose()
  }

  return (
    <div
      ref={ref}
      className="fixed z-[2000] rounded-lg border border-border bg-bg-fill shadow-xl py-1 min-w-[200px]"
      style={{ left: safeX, top: safeY, width: menuWidth }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ── 基础编辑 ── */}
      <MenuItem
        label="复制"
        shortcut="⌘C"
        onClick={() => run(duplicateSelectedElements)}
      />
      <MenuItem
        label="重命名"
        shortcut="⌘R"
        onClick={() => {
          setRenamingLayerId(targetElement.id)
          onClose()
        }}
      />

      <Divider />

      {/* ── 层级调整 ── */}
      <SectionLabel label="层级" />
      <MenuItem
        label="上移一层"
        shortcut="⌘]"
        onClick={() => run(() => changeSelectedElementsZIndex('up'))}
      />
      <MenuItem
        label="下移一层"
        shortcut="⌘["
        onClick={() => run(() => changeSelectedElementsZIndex('down'))}
      />
      <MenuItem
        label="移到顶层"
        shortcut="]"
        onClick={() => run(() => changeSelectedElementsZIndex('top'))}
      />
      <MenuItem
        label="移到底层"
        shortcut="["
        onClick={() => run(() => changeSelectedElementsZIndex('bottom'))}
      />

      <Divider />

      {/* ── 编组 / 解组 ── */}
      <SectionLabel label="编组" />
      <MenuItem
        label="创建编组"
        shortcut="⌘G"
        disabled={!isMulti}
        onClick={() => run(groupSelectedElements)}
      />
      <MenuItem
        label="取消编组"
        shortcut="⇧⌘G"
        disabled={!isGroup}
        onClick={() => run(() => ungroupElements(targetElement.id))}
      />

      <Divider />

      {/* ── 布局对齐 ── */}
      <SectionLabel label="布局" />
      <MenuItem
        label="宽高对齐为整数"
        onClick={() => run(() => alignSelectedToInteger('size'))}
      />
      <MenuItem
        label="位置对齐为整数"
        onClick={() => run(() => alignSelectedToInteger('position'))}
      />

      <Divider />

      {/* ── 状态控制 ── */}
      <SectionLabel label="状态" />
      <MenuItem
        label={isHidden ? '显示图层' : '隐藏图层'}
        shortcut="⇧⌘H"
        onClick={() => run(toggleSelectedElementsVisibility)}
      />
      <MenuItem
        label={isLocked ? '解锁图层' : '锁定图层'}
        shortcut="⇧⌘L"
        onClick={() => run(toggleSelectedElementsLock)}
      />

      <Divider />

      {/* ── 变换 ── */}
      <SectionLabel label="变换" />
      <MenuItem
        label="水平翻转"
        shortcut="⇧H"
        onClick={() => run(() => flipSelectedElements('horizontal'))}
      />
      <MenuItem
        label="垂直翻转"
        shortcut="⇧V"
        onClick={() => run(() => flipSelectedElements('vertical'))}
      />

      <Divider />

      {/* ── 删除 ── */}
      <MenuItem
        label="删除"
        shortcut="⌫"
        danger
        onClick={() => run(deleteSelectedElements)}
      />
    </div>
  )
}
