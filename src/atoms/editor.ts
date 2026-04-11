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

// 画布所有元素列表
const canvasElementsAtom = atom<CanvasElement[]>([])

// 当前选中的元素ID
const selectedElementIdAtom = atom<string | null>(null)

// 选中元素的派生原子
const selectedElementAtom = atom((get) => {
  const selectedId = get(selectedElementIdAtom)
  const elements = get(canvasElementsAtom)
  return elements.find((el) => el.id === selectedId) || null
})

// 画布缩放/设备尺寸
const editorConfigAtom = atom<EditorConfig>({
  scale: 100,
  device: 'desktop',
})

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
  useSelectedElementId,
  useSelectedElementIdValue,
  useSetSelectedElementId,
  getSelectedElementId,
  setSelectedElementId,
] = createAtomHooks(selectedElementIdAtom)

export const [
  ,
  useEditorConfig,
  useEditorConfigValue,
  useSetEditorConfig,
  getEditorConfig,
  setEditorConfig,
] = createAtomHooks(editorConfigAtom)

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

// 删除选中元素
export const deleteSelectedElement = () => {
  const selectedId = getSelectedElementId()
  if (!selectedId) return
  const elements = getCanvasElements()
  setCanvasElements(elements.filter((el) => el.id !== selectedId))
  setSelectedElementId(null)
}
