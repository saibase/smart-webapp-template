import type { PanInfo } from 'motion/react'
import { m } from 'motion/react'
import { nanoid } from 'nanoid'
import * as React from 'react'
import { useCallback, useEffect,useRef } from 'react'

import type { CanvasElement } from '~/atoms/editor'
import {
  addCanvasElement,
  addCanvasOffset,
  clearDragPreview,
  getCanvasElements,
  updateElementPosition,
  useCanvasElementsValue,
  useCanvasOffsetValue,
  useDragPreviewValue,
  useEditorConfigValue,
  useSelectedElementIdsValue,
  useSelectionBoxValue,
  useSetCanvasElements,
  useSetDragPreview,
  useSetSelectedElementIds,
  useSetSelectionBox,
  useToolModeValue,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'
import { Spring } from '~/lib/spring'

import { getComponentById } from '../registry'

type CanvasProps = {
  className?: string
}

export const Canvas: React.FC<CanvasProps> = ({ className }) => {
  const elements = useCanvasElementsValue()
  const selectedIds = useSelectedElementIdsValue()
  const setSelectedIds = useSetSelectedElementIds()
  const { scale } = useEditorConfigValue()
  const dragPreview = useDragPreviewValue()
  const setDragPreview = useSetDragPreview()
  const canvasOffset = useCanvasOffsetValue()
  const toolMode = useToolModeValue()
  const selectionBox = useSelectionBoxValue()
  const setSelectionBox = useSetSelectionBox()
  const setCanvasElements = useSetCanvasElements()
  const containerRef = useRef<HTMLDivElement>(null)
  const isBoxSelectingRef = useRef(false)
  // 多选批量拖拽时的实时偏移
  const [multiDragOffset, setMultiDragOffset] = React.useState({ x: 0, y: 0 })
  // 剪贴板 - 保存复制的元素数据
  const [copiedElements, setCopiedElements] = React.useState<
    CanvasElement[] | null
  >(null)

  // 处理画布整体平移 - 长按背景拖拽
  const handleCanvasPan = (_: unknown, info: PanInfo) => {
    addCanvasOffset(info.delta.x, info.delta.y)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'

    const componentId = e.dataTransfer.getData('componentId')
    if (!componentId || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const scaleFactor = scale / 100
    // Get mouse position relative to canvas container, subtract canvas offset
    const mouseX = e.clientX - rect.left - canvasOffset.x
    const mouseY = e.clientY - rect.top - canvasOffset.y
    // Convert to canvas's coordinate system (before scaling)
    const x = Math.round(mouseX / scaleFactor)
    const y = Math.round(mouseY / scaleFactor)

    setDragPreview({ componentId, x, y })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentId = e.dataTransfer.getData('componentId')
    if (!componentId) return

    const component = getComponentById(componentId)
    if (!component) return

    // Calculate position relative to canvas considering scale transformation and offset
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const scaleFactor = scale / 100
      const mouseX = e.clientX - rect.left - canvasOffset.x
      const mouseY = e.clientY - rect.top - canvasOffset.y
      const x = Math.round(mouseX / scaleFactor)
      const y = Math.round(mouseY / scaleFactor)

      const newElement: CanvasElement = {
        id: nanoid(),
        type: componentId,
        props: { ...component.defaultProps },
        position: { x, y },
        zIndex: elements.length,
      }

      addCanvasElement(newElement)
      clearDragPreview()
    }
  }

  const handleDragLeave = () => {
    clearDragPreview()
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    // 点击画布背景区域（不是元素，不是多选包围框）时，清除所有选择
    if (selectedIds.length > 0 && !selectionBox) {
      // 检查点击目标是否是画布容器或背景网格，确实在框外
      const target = e.target as HTMLElement
      const isBackground =
        target.classList.contains('bg-bg') ||
        (target.classList.contains('absolute') &&
          target.style.backgroundImage?.includes('radial-gradient'))
      if (isBackground || e.target === e.currentTarget) {
        setSelectedIds([])
      }
    }
  }

  // 处理多选包围框上的鼠标按下 - 已经在m.div上阻止了事件冒泡，这里不需要额外处理

  // 开始框选 - 鼠标按下在画布背景
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // 只响应鼠标左键 (button === 0)
      if (e.button !== 0) return

      if (toolMode !== 'select') {
        return
      }

      // 简化背景检查：只要不是元素本身就可以开始框选
      // 实际上，我们可以允许在任何地方开始框选，因为用户可能想从元素上开始框选
      // 但为了简单起见，我们先允许在任何地方开始
      if (!containerRef.current) {
        return
      }

      const rect = containerRef.current.getBoundingClientRect()
      // 鼠标在容器内的坐标，不需要减 canvasOffset，因为框选相对于容器绘制
      const startX = e.clientX - rect.left
      const startY = e.clientY - rect.top

      isBoxSelectingRef.current = true
      setSelectionBox({
        startX,
        startY,
        currentX: startX,
        currentY: startY,
      })

      // 阻止事件冒泡，避免触发其他点击事件
      e.stopPropagation()
    },
    [toolMode, setSelectionBox],
  )

  // 更新框选区域大小 - 鼠标移动
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isBoxSelectingRef.current || !selectionBox || !containerRef.current)
        return

      const rect = containerRef.current.getBoundingClientRect()
      // 同样，鼠标在容器内的坐标，不需要减 canvasOffset
      const currentX = e.clientX - rect.left
      const currentY = e.clientY - rect.top

      setSelectionBox({
        ...selectionBox,
        currentX,
        currentY,
      })
    },
    [selectionBox, setSelectionBox],
  )

  // 结束框选 - 鼠标松开，选中所有在框内的元素
  const handleMouseUp = useCallback(() => {
    if (!isBoxSelectingRef.current || !selectionBox) {
      isBoxSelectingRef.current = false
      setSelectionBox(null)
      return
    }

    // 需要转换为画布坐标进行碰撞检测
    // selectionBox.startX 已经是容器坐标，减去 canvasOffset 得到画布坐标
    const leftCanvas =
      Math.min(selectionBox.startX, selectionBox.currentX) - canvasOffset.x
    const rightCanvas =
      Math.max(selectionBox.startX, selectionBox.currentX) - canvasOffset.x
    const topCanvas =
      Math.min(selectionBox.startY, selectionBox.currentY) - canvasOffset.y
    const bottomCanvas =
      Math.max(selectionBox.startY, selectionBox.currentY) - canvasOffset.y

    // Find all elements that intersect with the selection box
    // Approximate: check if element's bounding box intersects
    const boxSelectedIds: string[] = []
    elements.forEach((el) => {
      // For simplicity, use element position and assume some default size
      // TODO: Get actual bounding box from rendered elements
      // Get width/height from either top-level props or style
      let elWidth =
        el.props.width || (el.props.style && el.props.style.width) || 200
      let elHeight =
        el.props.height || (el.props.style && el.props.style.height) || 50

      // Convert to number if it's a string with px
      if (typeof elWidth === 'string' && elWidth.endsWith('px')) {
        elWidth = Number.parseInt(elWidth, 10)
      } else if (elWidth === 'auto') {
        elWidth = 200
      }

      if (typeof elHeight === 'string' && elHeight.endsWith('px')) {
        elHeight = Number.parseInt(elHeight, 10)
      } else if (elHeight === 'auto') {
        elHeight = 50
      }

      const elRight = el.position.x + Number(elWidth)
      const elBottom = el.position.y + Number(elHeight)

      // Check intersection
      const intersects = !(
        rightCanvas < el.position.x ||
        leftCanvas > elRight ||
        bottomCanvas < el.position.y ||
        topCanvas > elBottom
      )

      if (intersects) {
        boxSelectedIds.push(el.id)
      }
    })

    // Select all elements in the box
    setSelectedIds(boxSelectedIds)

    isBoxSelectingRef.current = false
    setSelectionBox(null)
  }, [
    selectionBox,
    elements,
    canvasOffset.x,
    canvasOffset.y,
    setSelectedIds,
    setSelectionBox,
  ])

  // 拖拽结束时使用增量计算元素的新位置
  const handleElementDragEnd = (
    id: string,
    element: CanvasElement,
    _event: MouseEvent | PointerEvent | TouchEvent,
    info: PanInfo,
  ) => {
    const scaleFactor = scale / 100

    // info.delta 是本次拖拽的增量（屏幕像素）
    // 除以 scaleFactor 转换为画布原始坐标系
    const deltaX = info.delta.x / scaleFactor
    const deltaY = info.delta.y / scaleFactor

    // 原位置加上增量得到新位置
    const x = Math.round(element.position.x + deltaX)
    const y = Math.round(element.position.y + deltaY)

    updateElementPosition(id, { x, y })
  }

  // 批量拖拽过程中实时更新偏移 - 累积每次事件的增量
  const handleMultiSelectionPan = (_: unknown, info: PanInfo) => {
    if (selectedIds.length === 0) return

    const scaleFactor = scale / 100
    // info.delta 是本次事件相对于上一次事件的增量，累积它
    const deltaX = info.delta.x / scaleFactor
    const deltaY = info.delta.y / scaleFactor

    // 累积总偏移
    setMultiDragOffset((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))
  }

  // 批量拖拽多个选中元素结束 - 提交累积的总偏移到原子状态
  const handleMultiSelectionDragEnd = (_: unknown, _info: PanInfo) => {
    if (selectedIds.length === 0) return

    // 使用已经累积好的总偏移更新位置
    const deltaX = Math.round(multiDragOffset.x)
    const deltaY = Math.round(multiDragOffset.y)

    // 更新所有选中元素的位置
    const currentElements = getCanvasElements()
    const updatedElements = currentElements.map((el) => {
      if (selectedIds.includes(el.id)) {
        return {
          ...el,
          position: {
            x: el.position.x + deltaX,
            y: el.position.y + deltaY,
          },
        }
      }
      return el
    })

    setCanvasElements(updatedElements)
    // 重置实时偏移
    setMultiDragOffset({ x: 0, y: 0 })
  }

  // 处理键盘快捷键 - 删除、复制、粘贴
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Delete/Backspace 删除选中元素
      if (
        selectedIds.length > 0 &&
        (e.key === 'Delete' || e.key === 'Backspace')
      ) {
        e.preventDefault()
        const currentElements = getCanvasElements()
        const remainingElements = currentElements.filter(
          (el) => !selectedIds.includes(el.id),
        )
        setCanvasElements(remainingElements)
        setSelectedIds([])
        return
      }

      // Ctrl+C / Cmd+C 复制选中元素到剪贴板
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        if (selectedIds.length === 0) return

        const currentElements = getCanvasElements()
        const elementsToCopy = currentElements.filter((el) =>
          selectedIds.includes(el.id),
        )

        if (elementsToCopy.length === 0) return

        // 保存到内部剪贴板
        setCopiedElements(elementsToCopy)
        return
      }

      // Ctrl+V / Cmd+V 粘贴剪贴板中的元素
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        if (!copiedElements || copiedElements.length === 0) return

        const currentElements = getCanvasElements()
        // 计算当前画布最大z-index
        let maxZ = 0
        currentElements.forEach((el) => {
          if (el.zIndex > maxZ) maxZ = el.zIndex
        })

        // 每次粘贴偏移 20px，避免重叠
        const offsetX = 20
        const offsetY = 20

        // 粘贴每个元素，生成新id
        const pastedElements: CanvasElement[] = copiedElements.map(
          (el, index) => {
            const newId = nanoid()
            return {
              ...el,
              id: newId,
              position: {
                x: el.position.x + offsetX,
                y: el.position.y + offsetY,
              },
              zIndex: maxZ + index + 1,
            }
          },
        )

        const newElements = [...currentElements, ...pastedElements]
        setCanvasElements(newElements)
        // 选中新粘贴的元素
        setSelectedIds(pastedElements.map((el) => el.id))
        return
      }
    },
    [selectedIds, setCanvasElements, setSelectedIds, copiedElements],
  )

  // 添加键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  const renderElement = (element: CanvasElement) => {
    const componentMeta = getComponentById(element.type)
    if (!componentMeta) return null

    const Component = componentMeta.component
    const isSelected = selectedIds.includes(element.id)

    // 批量拖拽时，给选中元素添加实时偏移
    const currentX =
      selectedIds.includes(element.id) && multiDragOffset.x !== 0
        ? element.position.x + multiDragOffset.x
        : element.position.x
    const currentY =
      selectedIds.includes(element.id) && multiDragOffset.y !== 0
        ? element.position.y + multiDragOffset.y
        : element.position.y

    return (
      <m.div
        key={element.id}
        drag={toolMode === 'select'}
        dragMomentum={false}
        onDragEnd={(_event, info) =>
          handleElementDragEnd(element.id, element, _event, info)
        }
        onClick={(e) => {
          e.stopPropagation()
          // Clicking an element selects only that one
          setSelectedIds([element.id])
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={Spring.presets.smooth}
        style={{
          position: 'absolute',
          left: currentX,
          top: currentY,
          zIndex: element.zIndex,
          boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none',
          pointerEvents: toolMode === 'pan' ? 'none' : 'auto',
        }}
        className="outline-none"
      >
        <Component {...element.props} />
      </m.div>
    )
  }

  // 获取预览组件的预估尺寸
  const getPreviewSize = (componentId: string) => {
    switch (componentId) {
      case 'text': {
        return { width: 200, height: 40 }
      }
      case 'button': {
        return { width: 100, height: 40 }
      }
      case 'input': {
        return { width: 250, height: 40 }
      }
      case 'frame-mobile': {
        return { width: 375, height: 667 }
      }
      case 'frame-tablet': {
        return { width: 768, height: 1024 }
      }
      case 'frame-desktop': {
        return { width: 1440, height: 1024 }
      }
      default: {
        return { width: 150, height: 50 }
      }
    }
  }

  // 计算框选矩形的位置和大小（相对于容器）
  const getSelectionBoxStyle = () => {
    if (!selectionBox) return null

    // selectionBox.startX/currentX 已经是容器坐标，直接使用
    const left = Math.min(selectionBox.startX, selectionBox.currentX)
    const top = Math.min(selectionBox.startY, selectionBox.currentY)
    const width = Math.abs(selectionBox.currentX - selectionBox.startX)
    const height = Math.abs(selectionBox.currentY - selectionBox.startY)

    return { left, top, width, height }
  }

  // 计算多选元素的包围框（画布坐标系）
  const getMultiSelectionBoundingBox = () => {
    if (selectedIds.length === 0) return null
    if (selectedIds.length === 1) return null // 单个元素由自身高亮边框显示

    const selectedElements = elements.filter((el) =>
      selectedIds.includes(el.id),
    )
    if (selectedElements.length === 0) return null

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    selectedElements.forEach((el) => {
      // Get width/height from either top-level props or style
      let width =
        el.props.width || (el.props.style && el.props.style.width) || 200
      let height =
        el.props.height || (el.props.style && el.props.style.height) || 50

      // Convert to number if it's a string with px
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

      minX = Math.min(minX, el.position.x)
      minY = Math.min(minY, el.position.y)
      maxX = Math.max(maxX, el.position.x + Number(width))
      maxY = Math.max(maxY, el.position.y + Number(height))
    })

    // 添加padding让包围框更舒适
    const padding = 4
    return {
      left: minX - padding,
      top: minY - padding,
      width: maxX - minX + padding * 2,
      height: maxY - minY + padding * 2,
    }
  }

  const boxStyle = getSelectionBoxStyle()
  const multiSelectionBox = getMultiSelectionBoundingBox()

  return (
    <div
      className={cn('absolute inset-0 bg-bg overflow-hidden', className)}
      ref={containerRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 无限画布背景 - 可整体拖拽平移，仅平移模式允许拖拽 */}
      <m.div
        drag={toolMode === 'pan'}
        dragMomentum={false}
        onPanEnd={handleCanvasPan}
        className={cn(
          'absolute inset-0 transition-colors',
          toolMode === 'pan'
            ? 'cursor-grab active:cursor-grabbing'
            : 'cursor-default',
        )}
        style={{
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
        }}
        transition={Spring.presets.smooth}
      >
        {/* 无限大背景网格 - 提供无限画布视觉 */}
        <div
          className="absolute inset-[-10000px] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            backgroundColor: '#fafafa',
          }}
        />

        {/* 所有画布元素直接渲染在无限画布上 */}
        {elements.map((element) => renderElement(element))}

        {/* 拖拽预览 - 虚线边框 */}
        {dragPreview && (
          <div
            className="border-2 border-dashed border-blue-500 bg-blue-50/30 pointer-events-none"
            style={{
              position: 'absolute',
              left: dragPreview.x,
              top: dragPreview.y,
              ...getPreviewSize(dragPreview.componentId),
            }}
          />
        )}

        {elements.length === 0 && !dragPreview && !selectionBox && (
          <div className="flex items-center justify-center w-screen h-screen text-text-secondary">
            <p>从左侧拖拽组件到这里开始编辑</p>
          </div>
        )}

        {/* 多选持久化包围框 - 跟随画布偏移，可拖动批量移动 */}
        {multiSelectionBox && toolMode === 'select' && (
          <m.div
            drag={false}
            onPan={handleMultiSelectionPan}
            onPanEnd={handleMultiSelectionDragEnd}
            onMouseDown={(e) => {
              // 阻止事件冒泡，不触发画布的框选
              e.stopPropagation()
            }}
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-auto cursor-move z-40"
            style={{
              left: multiSelectionBox.left + multiDragOffset.x,
              top: multiSelectionBox.top + multiDragOffset.y,
              width: multiSelectionBox.width,
              height: multiSelectionBox.height,
            }}
            transition={Spring.presets.smooth}
          />
        )}
      </m.div>

      {/* 框选矩形 - 跟随鼠标拖拽，放在最外层不跟随画布偏移 */}
      {boxStyle && (
        <div
          className="absolute border-2 border-dashed border-blue-500 bg-blue-500/20 pointer-events-none z-50"
          style={{
            left: boxStyle.left,
            top: boxStyle.top,
            width: boxStyle.width,
            height: boxStyle.height,
          }}
        />
      )}
    </div>
  )
}
