import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai'
import { nanoid } from 'nanoid'

import { createAtomHooks } from '~/lib/jotai'

// ───────── 左侧面板 Tab ─────────
export type LeftPanelTab = 'layers' | 'resources'
const leftPanelTabAtom = atom<LeftPanelTab>('layers')

// ───────── 资源面板子 Tab ─────────
export type ResourceTab = 'components' | 'images' | 'icons' | 'text'
const resourceTabAtom = atom<ResourceTab>('components')

// ───────── 图层树展开节点 ─────────
const expandedLayerIdsAtom = atom<string[]>([])

// ───────── 图层搜索 ─────────
const layerSearchQueryAtom = atom<string>('')
const layerSearchVisibleAtom = atom<boolean>(false)

// 画布元素类型定义
export type CanvasElementPosition = {
  x: number
  y: number
}

export type CanvasElement = {
  id: string
  type: string
  props: Record<string, any>
  position: CanvasElementPosition
  zIndex: number
  parentId?: string // 父组ID，支持二级嵌套
}

// 编辑器配置类型
export type EditorConfig = {
  scale: number
  device: 'mobile' | 'tablet' | 'desktop'
}

// 画布整体偏移量（用于整体平移）
export type CanvasOffset = {
  x: number
  y: number
}

// 拖拽预览类型
export type DragPreview = {
  componentId: string
  x: number
  y: number
} | null

// 框选区域类型（用于鼠标框选多个元素）
export type SelectionBox = {
  startX: number
  startY: number
  currentX: number
  currentY: number
} | null

// 画布所有元素列表
const canvasElementsAtom = atom<CanvasElement[]>([])

// 当前选中的元素ID集合（支持多选）
const selectedElementIdsAtom = atom<string[]>([])

// 选中第一个元素的派生原子（用于属性面板显示）
const selectedElementAtom = atom((get) => {
  const selectedIds = get(selectedElementIdsAtom)
  if (selectedIds.length === 0) return null
  const elements = get(canvasElementsAtom)
  return elements.find((el) => el.id === selectedIds[0]) || null
})

// 所有选中元素的派生原子
const selectedElementsAtom = atom((get) => {
  const selectedIds = get(selectedElementIdsAtom)
  const elements = get(canvasElementsAtom)
  return elements.filter((el) => selectedIds.includes(el.id))
})

// 画布缩放/设备尺寸
const editorConfigAtom = atom<EditorConfig>({
  scale: 100,
  device: 'desktop',
})

// 画布整体偏移量（支持无限画布平移）
const canvasOffsetAtom = atom<CanvasOffset>({
  x: 0,
  y: 0,
})

// 当前拖拽预览
const dragPreviewAtom = atom<DragPreview>(null)

// 编辑器工具模式
export type ToolMode =
  | 'select'
  | 'pan'
  | 'rect'
  | 'text'
  | 'pen'
  | 'ellipse'
  | 'mask'

// 当前工具模式
const toolModeAtom = atom<ToolMode>('select')

// 工作流标签
export type EditorWorkflow = 'design' | 'prototype' | 'annotation'
const editorWorkflowAtom = atom<EditorWorkflow>('design')

// 框选区域（鼠标框选多个元素）
const selectionBoxAtom = atom<SelectionBox>(null)

// 使用 createAtomHooks 创建钩子
export const [
  ,
  useCanvasElements,
  useCanvasElementsValue,
  useSetCanvasElements,
  getCanvasElements,
  setCanvasElements,
] = createAtomHooks(canvasElementsAtom)

export const [
  ,
  useSelectedElementIds,
  useSelectedElementIdsValue,
  useSetSelectedElementIds,
  getSelectedElementIds,
  setSelectedElementIds,
] = createAtomHooks(selectedElementIdsAtom)

export const [
  ,
  useEditorConfig,
  useEditorConfigValue,
  useSetEditorConfig,
  getEditorConfig,
  setEditorConfig,
] = createAtomHooks(editorConfigAtom)

export const [
  ,
  useDragPreview,
  useDragPreviewValue,
  useSetDragPreview,
  getDragPreview,
  setDragPreview,
] = createAtomHooks(dragPreviewAtom)

export const [
  ,
  useCanvasOffset,
  useCanvasOffsetValue,
  useSetCanvasOffset,
  getCanvasOffset,
  setCanvasOffset,
] = createAtomHooks(canvasOffsetAtom)

export const [
  ,
  useToolMode,
  useToolModeValue,
  useSetToolMode,
  getToolMode,
  setToolMode,
] = createAtomHooks(toolModeAtom)

export const [
  ,
  useSelectionBox,
  useSelectionBoxValue,
  useSetSelectionBox,
  getSelectionBox,
  setSelectionBox,
] = createAtomHooks(selectionBoxAtom)

// 更新画布整体偏移
export const updateCanvasOffset = (offset: CanvasOffset) => {
  setCanvasOffset(offset)
}

// 增量更新画布偏移
export const addCanvasOffset = (deltaX: number, deltaY: number) => {
  const current = getCanvasOffset()
  setCanvasOffset({
    x: current.x + deltaX,
    y: current.y + deltaY,
  })
}

// 只读派生原子，手动创建钩子
export const useSelectedElement = () => {
  return useAtom(selectedElementAtom)
}

export const useSelectedElementValue = () => {
  return useAtomValue(selectedElementAtom)
}

export const getSelectedElement = () => {
  const store = getDefaultStore()
  return store.get(selectedElementAtom)
}

// 添加新元素到画布
export const addCanvasElement = (element: CanvasElement) => {
  const elements = getCanvasElements()
  setCanvasElements([...elements, element])
}

// 更新元素位置
export const updateElementPosition = (
  id: string,
  position: CanvasElementPosition,
) => {
  const elements = getCanvasElements()
  setCanvasElements(
    elements.map((el) => (el.id === id ? { ...el, position } : el)),
  )
}

// 更新元素属性
export const updateElementProps = (id: string, props: Record<string, any>) => {
  const elements = getCanvasElements()
  setCanvasElements(
    elements.map((el) =>
      el.id === id ? { ...el, props: { ...el.props, ...props } } : el,
    ),
  )
}

// 删除选中元素（支持多选）
export const deleteSelectedElements = () => {
  const selectedIds = getSelectedElementIds()
  if (selectedIds.length === 0) return
  const elements = getCanvasElements()
  setCanvasElements(elements.filter((el) => !selectedIds.includes(el.id)))
  setSelectedElementIds([])
}

// 兼容旧名称
export const deleteSelectedElement = deleteSelectedElements

// 只读派生原子 - 获取所有选中元素
export const useSelectedElementsValue = () => {
  return useAtomValue(selectedElementsAtom)
}

export const getSelectedElements = () => {
  const store = getDefaultStore()
  return store.get(selectedElementsAtom)
}

// 清除拖拽预览
export const clearDragPreview = () => {
  setDragPreview(null)
}

// 层级调整操作
export type ZIndexChangeType = 'up' | 'down' | 'top' | 'bottom'

// 调整选中元素的层级
export const changeSelectedElementsZIndex = (changeType: ZIndexChangeType) => {
  const elements = getCanvasElements()
  const selectedIds = getSelectedElements().map((el) => el.id)

  if (selectedIds.length === 0) return

  // 找到最小和最大zIndex
  let minZ = Infinity
  let maxZ = -Infinity
  elements.forEach((el) => {
    if (el.zIndex < minZ) minZ = el.zIndex
    if (el.zIndex > maxZ) maxZ = el.zIndex
  })

  // 根据操作调整zIndex
  const updatedElements = elements.map((el) => {
    if (!selectedIds.includes(el.id)) return el

    let newZIndex = el.zIndex
    switch (changeType) {
      case 'up': {
        // 上一层 - zIndex增加
        newZIndex = el.zIndex + 1
        break
      }
      case 'down': {
        // 下一层 - zIndex减少
        newZIndex = el.zIndex - 1
        break
      }
      case 'top': {
        // 顶层 - 放到最上面，保持选中元素之间原有的顺序
        newZIndex = maxZ + selectedIds.indexOf(el.id) + 1
        break
      }
      case 'bottom': {
        // 底层 - 放到最下面，保持选中元素之间原有的顺序
        newZIndex = minZ - selectedIds.length + selectedIds.indexOf(el.id)
        break
      }
    }

    return { ...el, zIndex: newZIndex }
  })

  setCanvasElements(updatedElements)
}

// 编组操作 - 将选中多个元素组合成一个组
export const groupSelectedElements = () => {
  const elements = getCanvasElements()
  const selectedIds = getSelectedElements().map((el) => el.id)

  if (selectedIds.length < 2) return // 至少两个元素才能编组

  // 计算组的包围框，确定组位置
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  selectedIds.forEach((id) => {
    const el = elements.find((e) => e.id === id)
    if (!el) return

    let width =
      el.props.width || (el.props.style && el.props.style.width) || 200
    let height =
      el.props.height || (el.props.style && el.props.style.height) || 50

    if (typeof width === 'string' && width.endsWith('px')) {
      width = Number.parseInt(width, 10)
    } else if (width === 'auto') {
      width = 200
    }

    if (typeof height === 'string' && height.endsWith('px')) {
      height = Number.parseInt(height, 10)
    } else if (height === 'auto') {
      height = 50
    }

    const w = Number(width)
    const h = Number(height)
    minX = Math.min(minX, el.position.x)
    minY = Math.min(minY, el.position.y)
    maxX = Math.max(maxX, el.position.x + w)
    maxY = Math.max(maxY, el.position.y + h)
  })

  const groupWidth = maxX - minX
  const groupHeight = maxY - minY

  // 创建一个组容器元素
  const groupId = nanoid()
  const groupElement: CanvasElement = {
    id: groupId,
    type: 'group',
    position: { x: minX, y: minY },
    zIndex:
      Math.max(
        ...selectedIds.map(
          (id) => elements.find((e) => e.id === id)?.zIndex || 0,
        ),
      ) + 1,
    props: {
      label: '组',
      width: groupWidth,
      height: groupHeight,
      style: {
        width: groupWidth,
        height: groupHeight,
        border: '2px dashed #3b82f6',
        backgroundColor: 'transparent',
      },
    },
  }

  // 将选中元素设置父组ID，调整位置相对于组
  const updatedElements = elements.map((el) => {
    if (selectedIds.includes(el.id)) {
      // 相对于组调整位置
      const relativeX = el.position.x - minX
      const relativeY = el.position.y - minY
      return {
        ...el,
        parentId: groupId,
        position: { x: relativeX, y: relativeY },
      }
    }
    return el
  })

  // 添加组元素
  updatedElements.push(groupElement)

  setCanvasElements(updatedElements)
  setSelectedElementIds([groupId])
  // 编组后自动展开，使子图层可见
  const expanded = getExpandedLayerIds()
  if (!expanded.includes(groupId)) {
    setExpandedLayerIds([...expanded, groupId])
  }
}

// ───────── 左侧面板 hooks ─────────
export const [
  ,
  useLeftPanelTab,
  useLeftPanelTabValue,
  useSetLeftPanelTab,
  getLeftPanelTab,
  setLeftPanelTab,
] = createAtomHooks(leftPanelTabAtom)

export const [
  ,
  useResourceTab,
  useResourceTabValue,
  useSetResourceTab,
  getResourceTab,
  setResourceTab,
] = createAtomHooks(resourceTabAtom)

export const [
  ,
  useExpandedLayerIds,
  useExpandedLayerIdsValue,
  useSetExpandedLayerIds,
  getExpandedLayerIds,
  setExpandedLayerIds,
] = createAtomHooks(expandedLayerIdsAtom)

export const [
  ,
  useLayerSearchQuery,
  useLayerSearchQueryValue,
  useSetLayerSearchQuery,
  getLayerSearchQuery,
  setLayerSearchQuery,
] = createAtomHooks(layerSearchQueryAtom)

export const [
  ,
  useLayerSearchVisible,
  useLayerSearchVisibleValue,
  useSetLayerSearchVisible,
  getLayerSearchVisible,
  setLayerSearchVisible,
] = createAtomHooks(layerSearchVisibleAtom)

// 解组 - 解散组，子元素恢复独立
export const ungroupElements = (groupId: string) => {
  const elements = getCanvasElements()
  const group = elements.find((el) => el.id === groupId)
  if (!group || group.type !== 'group') return

  // 获取组位置
  const groupX = group.position.x
  const groupY = group.position.y

  // 找到所有子元素，恢复它们的绝对位置并移除parentId
  const updatedElements = elements
    .filter((el) => el.id !== groupId) // 删除组元素
    .map((el) => {
      if (el.parentId === groupId) {
        // 恢复绝对位置
        return {
          ...el,
          parentId: undefined,
          position: {
            x: groupX + el.position.x,
            y: groupY + el.position.y,
          },
        }
      }
      return el
    })

  setCanvasElements(updatedElements)
  setSelectedElementIds([])
}

// ───────── 元素绝对坐标计算（考虑父子嵌套）─────────
export const getAbsolutePosition = (
  elementId: string,
  allElements: CanvasElement[],
): { x: number; y: number } => {
  const el = allElements.find((e) => e.id === elementId)
  if (!el) return { x: 0, y: 0 }
  if (!el.parentId) return { ...el.position }
  const parentPos = getAbsolutePosition(el.parentId, allElements)
  return { x: parentPos.x + el.position.x, y: parentPos.y + el.position.y }
}

// 判断 ancestorId 是否是 childId 的祖先
const isAncestorOf = (
  ancestorId: string,
  childId: string,
  allElements: CanvasElement[],
): boolean => {
  const child = allElements.find((e) => e.id === childId)
  if (!child?.parentId) return false
  if (child.parentId === ancestorId) return true
  return isAncestorOf(ancestorId, child.parentId, allElements)
}

// ───────── 图层重组（拖拽至目标图层）─────────
// mode 'child'  → 成为 targetId 的子节点
// mode 'before' → 成为 targetId 的前置同级
// mode 'after'  → 成为 targetId 的后置同级
export const reparentElement = (
  elementId: string,
  targetId: string | null,
  mode: 'before' | 'child' | 'after' = 'child',
) => {
  const elements = getCanvasElements()
  const el = elements.find((e) => e.id === elementId)
  if (!el) return
  if (elementId === targetId) return
  // 源元素本身锁定 → 不可拖
  if (el.props?.locked) return
  // 源元素的父级锁定 → 不可从父级中拖出
  if (el.parentId) {
    const parent = elements.find((e) => e.id === el.parentId)
    if (parent?.props?.locked) return
  }
  // 不允许将元素挂到自己的后代上（避免循环引用）
  if (targetId && isAncestorOf(elementId, targetId, elements)) return

  // 目标自身或目标父级锁定 → 不可落入
  if (targetId) {
    const target = elements.find((e) => e.id === targetId)
    if (target?.props?.locked) return
    // before/after 模式：新父级 = 目标的父级，检查父级锁定
    if (mode !== 'child' && target?.parentId) {
      const targetParent = elements.find((e) => e.id === target.parentId)
      if (targetParent?.props?.locked) return
    }
  }

  const elAbsPos = getAbsolutePosition(elementId, elements)

  let newParentId: string | undefined
  let newPosition: { x: number; y: number }
  let newZIndex: number | undefined

  if (mode === 'child' && targetId) {
    newParentId = targetId
    const targetAbsPos = getAbsolutePosition(targetId, elements)
    newPosition = {
      x: elAbsPos.x - targetAbsPos.x,
      y: elAbsPos.y - targetAbsPos.y,
    }
  } else {
    // before / after → 成为 target 的同级
    const target = elements.find((e) => e.id === targetId)
    newParentId = target?.parentId

    if (newParentId) {
      const parentAbsPos = getAbsolutePosition(newParentId, elements)
      newPosition = {
        x: elAbsPos.x - parentAbsPos.x,
        y: elAbsPos.y - parentAbsPos.y,
      }
    } else {
      newPosition = elAbsPos
    }

    if (target) {
      newZIndex = mode === 'before' ? target.zIndex + 1 : target.zIndex - 1
    }
  }

  setCanvasElements(
    elements.map((e) => {
      if (e.id === elementId) {
        return {
          ...e,
          parentId: newParentId,
          position: newPosition,
          zIndex: newZIndex !== undefined ? newZIndex : e.zIndex,
        }
      }
      return e
    }),
  )

  // 展开新父节点（若有）
  if (newParentId) {
    const expanded = getExpandedLayerIds()
    if (!expanded.includes(newParentId)) {
      setExpandedLayerIds([...expanded, newParentId])
    }
  }
}

// ───────── 内联重命名 atom ─────────
const renamingLayerIdAtom = atom<string | null>(null)

export const [
  ,
  useRenamingLayerId,
  useRenamingLayerIdValue,
  useSetRenamingLayerId,
  getRenamingLayerId,
  setRenamingLayerId,
] = createAtomHooks(renamingLayerIdAtom)

// ───────── 复制选中元素 ─────────
export const duplicateSelectedElements = () => {
  const elements = getCanvasElements()
  const selected = getSelectedElements()
  if (selected.length === 0) return

  const OFFSET = 10
  const newElements: CanvasElement[] = selected.map((el) => ({
    ...el,
    id: nanoid(),
    position: { x: el.position.x + OFFSET, y: el.position.y + OFFSET },
    zIndex: Math.max(...elements.map((e) => e.zIndex)) + 1,
    parentId: undefined, // 复制后脱离组
  }))

  setCanvasElements([...elements, ...newElements])
  setSelectedElementIds(newElements.map((el) => el.id))
}

// ───────── 翻转选中元素 ─────────
export const flipSelectedElements = (direction: 'horizontal' | 'vertical') => {
  const elements = getCanvasElements()
  const selectedIds = getSelectedElements().map((el) => el.id)
  if (selectedIds.length === 0) return

  const updated = elements.map((el) => {
    if (!selectedIds.includes(el.id)) return el
    const flipKey = direction === 'horizontal' ? '_flipX' : '_flipY'
    return {
      ...el,
      props: { ...el.props, [flipKey]: !el.props[flipKey] },
    }
  })

  setCanvasElements(updated)
}

// ───────── 位置/尺寸对齐为整数 ─────────
const roundSize = (v: unknown): unknown => {
  if (typeof v === 'number') return Math.round(v)
  if (typeof v === 'string' && v.endsWith('px')) {
    return `${Math.round(Number.parseFloat(v))}px`
  }
  return v
}

export const alignSelectedToInteger = (
  target: 'position' | 'size' | 'both' = 'both',
) => {
  const elements = getCanvasElements()
  const selectedIds = getSelectedElements().map((el) => el.id)
  if (selectedIds.length === 0) return

  const updated = elements.map((el) => {
    if (!selectedIds.includes(el.id)) return el

    const pos =
      target !== 'size'
        ? {
            x: Math.round(el.position.x),
            y: Math.round(el.position.y),
          }
        : el.position

    const newProps = { ...el.props }
    if (target !== 'position') {
      if (newProps.style) {
        newProps.style = {
          ...newProps.style,
          width: roundSize(newProps.style.width),
          height: roundSize(newProps.style.height),
        }
      }
      if ('width' in newProps) newProps.width = roundSize(newProps.width)
      if ('height' in newProps) newProps.height = roundSize(newProps.height)
    }

    return { ...el, position: pos, props: newProps }
  })

  setCanvasElements(updated)
}

// ───────── 批量切换选中元素的显示/隐藏 ─────────
export const toggleSelectedElementsVisibility = () => {
  const elements = getCanvasElements()
  const selected = getSelectedElements()
  if (selected.length === 0) return

  // 若全部可见则全部隐藏，否则全部显示
  const allVisible = selected.every((el) => el.props?.visible !== false)
  const updated = elements.map((el) => {
    if (!selected.find((s) => s.id === el.id)) return el
    return { ...el, props: { ...el.props, visible: !allVisible } }
  })

  setCanvasElements(updated)
}

// ───────── 批量切换选中元素的锁定状态 ─────────
// 锁定多个元素：先编组再锁定该组
// 解锁：若目标是一个锁定的组则解组，否则直接解锁
export const toggleSelectedElementsLock = () => {
  const elements = getCanvasElements()
  const selected = getSelectedElements()
  if (selected.length === 0) return

  const allLocked = selected.every((el) => el.props?.locked === true)

  if (allLocked) {
    // 解锁：若单个选中元素是 group 类型则解组，否则直接解锁
    if (selected.length === 1 && selected[0].type === 'group') {
      ungroupElements(selected[0].id)
    } else {
      const updated = elements.map((el) => {
        if (!selected.find((s) => s.id === el.id)) return el
        return { ...el, props: { ...el.props, locked: false } }
      })
      setCanvasElements(updated)
    }
  } else if (selected.length > 1) {
    // 多个元素 → 编组后锁定该组
    const selectedIds = selected.map((el) => el.id)
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    selectedIds.forEach((id) => {
      const el = elements.find((e) => e.id === id)
      if (!el) return
      let w = el.props.width || (el.props.style && el.props.style.width) || 200
      let h = el.props.height || (el.props.style && el.props.style.height) || 50
      if (typeof w === 'string' && w.endsWith('px')) w = Number.parseInt(w, 10)
      else if (w === 'auto') w = 200
      if (typeof h === 'string' && h.endsWith('px')) h = Number.parseInt(h, 10)
      else if (h === 'auto') h = 50
      minX = Math.min(minX, el.position.x)
      minY = Math.min(minY, el.position.y)
      maxX = Math.max(maxX, el.position.x + Number(w))
      maxY = Math.max(maxY, el.position.y + Number(h))
    })

    const groupWidth = maxX - minX
    const groupHeight = maxY - minY
    const groupId = nanoid()

    const groupElement: CanvasElement = {
      id: groupId,
      type: 'group',
      position: { x: minX, y: minY },
      zIndex:
        Math.max(
          ...selectedIds.map(
            (id) => elements.find((e) => e.id === id)?.zIndex || 0,
          ),
        ) + 1,
      props: {
        label: '组',
        width: groupWidth,
        height: groupHeight,
        locked: true,
        style: {
          width: groupWidth,
          height: groupHeight,
          border: '2px dashed #3b82f6',
          backgroundColor: 'transparent',
        },
      },
    }

    const updatedElements = elements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return {
          ...el,
          parentId: groupId,
          position: { x: el.position.x - minX, y: el.position.y - minY },
        }
      }
      return el
    })
    updatedElements.push(groupElement)

    setCanvasElements(updatedElements)
    setSelectedElementIds([groupId])

    // 自动展开新组
    const expanded = getExpandedLayerIds()
    if (!expanded.includes(groupId)) {
      setExpandedLayerIds([...expanded, groupId])
    }
  } else {
    // 单个元素：直接切换锁定状态
    const updated = elements.map((el) => {
      if (!selected.find((s) => s.id === el.id)) return el
      return { ...el, props: { ...el.props, locked: !allLocked } }
    })
    setCanvasElements(updated)
  }
}

// ───────── 重命名图层（修改 props.label）─────────
export const renameLayer = (id: string, newName: string) => {
  updateElementProps(id, { label: newName })
}

// ───────── 工作流标签 hooks ─────────
export const [
  ,
  useEditorWorkflow,
  useEditorWorkflowValue,
  useSetEditorWorkflow,
  getEditorWorkflow,
  setEditorWorkflow,
] = createAtomHooks(editorWorkflowAtom)

// ───────── 对齐操作 ─────────
export type AlignType =
  | 'left'
  | 'hCenter'
  | 'right'
  | 'top'
  | 'vCenter'
  | 'bottom'
  | 'hDistribute'
  | 'vDistribute'

// 提取元素数值尺寸
const getElemSize = (el: CanvasElement) => {
  let w: unknown = el.props.style?.width ?? el.props.width ?? 200
  let h: unknown = el.props.style?.height ?? el.props.height ?? 50
  if (typeof w === 'string')
    w = w.endsWith('px')
      ? Number.parseFloat(w)
      : w === 'auto'
        ? 200
        : Number.parseFloat(w) || 200
  if (typeof h === 'string')
    h = h.endsWith('px')
      ? Number.parseFloat(h)
      : h === 'auto'
        ? 50
        : Number.parseFloat(h) || 50
  return { w: Number(w), h: Number(h) }
}

export const alignSelectedElements = (type: AlignType) => {
  const elements = getCanvasElements()
  const selected = getSelectedElements()
  if (selected.length < 2) return

  const boxes = selected.map((el) => {
    const { w, h } = getElemSize(el)
    return { id: el.id, x: el.position.x, y: el.position.y, w, h }
  })

  const minX = Math.min(...boxes.map((b) => b.x))
  const maxX = Math.max(...boxes.map((b) => b.x + b.w))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxY = Math.max(...boxes.map((b) => b.y + b.h))
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  const updates: Record<string, { x: number; y: number }> = {}

  switch (type) {
    case 'left': {
      for (const b of boxes) updates[b.id] = { x: minX, y: b.y }
      break
    }
    case 'hCenter': {
      for (const b of boxes) updates[b.id] = { x: cx - b.w / 2, y: b.y }
      break
    }
    case 'right': {
      for (const b of boxes) updates[b.id] = { x: maxX - b.w, y: b.y }
      break
    }
    case 'top': {
      for (const b of boxes) updates[b.id] = { x: b.x, y: minY }
      break
    }
    case 'vCenter': {
      for (const b of boxes) updates[b.id] = { x: b.x, y: cy - b.h / 2 }
      break
    }
    case 'bottom': {
      for (const b of boxes) updates[b.id] = { x: b.x, y: maxY - b.h }
      break
    }
    case 'hDistribute': {
      const sorted = [...boxes].sort((a, b) => a.x - b.x)
      const totalW = sorted.reduce((s, b) => s + b.w, 0)
      const gap = (maxX - minX - totalW) / (sorted.length - 1)
      let curX = minX
      for (const b of sorted) {
        updates[b.id] = { x: curX, y: b.y }
        curX += b.w + gap
      }
      break
    }
    case 'vDistribute': {
      const sorted = [...boxes].sort((a, b) => a.y - b.y)
      const totalH = sorted.reduce((s, b) => s + b.h, 0)
      const gap = (maxY - minY - totalH) / (sorted.length - 1)
      let curY = minY
      for (const b of sorted) {
        updates[b.id] = { x: b.x, y: curY }
        curY += b.h + gap
      }
      break
    }
  }

  setCanvasElements(
    elements.map((el) => {
      const upd = updates[el.id]
      return upd ? { ...el, position: upd } : el
    }),
  )
}
