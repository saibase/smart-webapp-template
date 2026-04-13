import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai'
import { nanoid } from 'nanoid'

import { createAtomHooks } from '~/lib/jotai'

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
export type ToolMode = 'select' | 'pan'

// 当前工具模式
const toolModeAtom = atom<ToolMode>('select')

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
}

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
