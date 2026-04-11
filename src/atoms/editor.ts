import { atom, getDefaultStore, useAtom, useAtomValue } from 'jotai'

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
