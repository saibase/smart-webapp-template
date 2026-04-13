/**
 * 右侧属性检查器（Design Mode）
 * 章节：对齐 → 变换 → 混合 → 填充 → 描边 → 特效 → 导出
 */
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'

import type { AlignType, CanvasElement } from '~/atoms/editor'
import {
  alignSelectedElements,
  deleteSelectedElements,
  updateElementPosition,
  updateElementProps,
  useSelectedElementsValue,
} from '~/atoms/editor'
import { cn } from '~/lib/cn'

// ─────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────
const toNum = (v: unknown, fallback = 0): number => {
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    if (v.endsWith('px')) return Number.parseFloat(v) || fallback
    if (v === 'auto') return fallback
    return Number.parseFloat(v) || fallback
  }
  return fallback
}

const getSize = (el: CanvasElement) => ({
  w: toNum(el.props.style?.width ?? el.props.width, 200),
  h: toNum(el.props.style?.height ?? el.props.height, 50),
})

// ─────────────────────────────────────────────────────────
// 可复用组件
// ─────────────────────────────────────────────────────────

/** 章节标题 */
const SectionHeader: React.FC<{
  title: string
  action?: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  children?: React.ReactNode
}> = ({ title, action, collapsible = false, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border">
      <div
        className={cn(
          'flex items-center justify-between px-3 py-2',
          collapsible &&
            'cursor-pointer hover:bg-fill-secondary transition-colors',
        )}
        onClick={() => collapsible && setOpen((v) => !v)}
      >
        <div className="flex items-center gap-1.5">
          {collapsible && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{
                transition: 'transform 0.15s',
                transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
            {title}
          </span>
        </div>
        {action}
      </div>
      {(!collapsible || open) && children && (
        <div className="pb-3">{children}</div>
      )}
    </div>
  )
}

/** 小数值输入框（X/Y/W/H/角度/圆角等） */
const NumInput: React.FC<{
  label: string
  value: number
  onChange: (v: number) => void
  unit?: string
  min?: number
  step?: number
}> = ({ label, value, onChange, unit = '', min, step = 1 }) => {
  const [local, setLocal] = useState(String(Math.round(value)))

  useEffect(() => {
    setLocal(String(Math.round(value)))
  }, [value])

  const commit = () => {
    const n = Number.parseFloat(local)
    if (!Number.isNaN(n)) {
      const clamped = min !== undefined ? Math.max(min, n) : n
      onChange(clamped)
      setLocal(String(Math.round(clamped)))
    } else {
      setLocal(String(Math.round(value)))
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10px] text-text-tertiary leading-none px-0.5">
        {label}
      </label>
      <div className="flex items-center bg-fill-secondary rounded border border-transparent focus-within:border-primary transition-colors">
        <input
          className="flex-1 min-w-0 bg-transparent text-xs text-text px-2 py-1.5 outline-none tabular-nums"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
          }}
          step={step}
        />
        {unit && (
          <span className="text-[10px] text-text-tertiary pr-1.5 shrink-0">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

/** 色块 + 输入 */
const ColorInput: React.FC<{
  label?: string
  value: string
  onChange: (v: string) => void
}> = ({ label, value, onChange }) => {
  const safeColor = /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label className="text-[10px] text-text-tertiary px-0.5">{label}</label>
      )}
      <div className="flex items-center gap-1.5 bg-fill-secondary rounded border border-transparent hover:border-border focus-within:border-primary transition-colors px-1.5 py-1">
        <input
          type="color"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-4 h-4 rounded-sm overflow-hidden cursor-pointer border-0 bg-transparent p-0 shrink-0"
        />
        <input
          className="flex-1 min-w-0 bg-transparent text-xs text-text outline-none uppercase tabular-nums"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            if (!/^#[0-9a-f]{3,8}$/i.test(e.target.value)) onChange(safeColor)
          }}
          maxLength={9}
        />
      </div>
    </div>
  )
}

/** 添加按钮 */
const AddBtn: React.FC<{ onClick: () => void; title?: string }> = ({
  onClick,
  title,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="w-5 h-5 flex items-center justify-center rounded text-text-tertiary hover:bg-fill-secondary hover:text-text transition-colors"
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  </button>
)

// ─────────────────────────────────────────────────────────
// 1. 对齐面板
// ─────────────────────────────────────────────────────────
const ALIGN_BUTTONS: {
  type: AlignType
  title: string
  icon: React.ReactNode
}[] = [
  {
    type: 'left',
    title: '左对齐',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4v16M10 6H6m0 6h10m-10 6h7" />
      </svg>
    ),
  },
  {
    type: 'hCenter',
    title: '水平居中',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 4v16M8 6h8M6 12h12M9 18h6" />
      </svg>
    ),
  },
  {
    type: 'right',
    title: '右对齐',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 4v16M14 6h-8m8 6H8m5 6H8" />
      </svg>
    ),
  },
  {
    type: 'top',
    title: '顶对齐',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16M8 20V8m8 12v-6M14 12V8" />
      </svg>
    ),
  },
  {
    type: 'vCenter',
    title: '垂直居中',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 12h16M8 6v12M16 8v8" />
      </svg>
    ),
  },
  {
    type: 'bottom',
    title: '底对齐',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 20h16M8 4v12m8 0V10" />
      </svg>
    ),
  },
  {
    type: 'hDistribute',
    title: '水平等距',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4v16M20 4v16M9 8h6v8H9z" />
      </svg>
    ),
  },
  {
    type: 'vDistribute',
    title: '垂直等距',
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 4h16M4 20h16M8 9v6h8V9z" />
      </svg>
    ),
  },
]

const AlignPanel: React.FC<{ count: number }> = ({ count }) => {
  const disabled = count < 2
  return (
    <SectionHeader title="对齐">
      <div className="px-3 pt-1">
        <div className="grid grid-cols-8 gap-0.5">
          {ALIGN_BUTTONS.map(({ type, title, icon }) => (
            <button
              key={type}
              type="button"
              title={title + (disabled ? '（需选中 2+ 元素）' : '')}
              disabled={disabled}
              onClick={() => alignSelectedElements(type)}
              className={cn(
                'flex items-center justify-center h-7 rounded transition-colors',
                disabled
                  ? 'text-text-tertiary opacity-40 cursor-not-allowed'
                  : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 2. 变换面板（位置 / 尺寸 / 旋转 / 圆角）
// ─────────────────────────────────────────────────────────
const TransformPanel: React.FC<{ element: CanvasElement }> = ({ element }) => {
  const { w, h } = getSize(element)
  const [lockRatio, setLockRatio] = useState(false)
  const ratioRef = useRef(w / Math.max(h, 1))

  useEffect(() => {
    ratioRef.current = w / Math.max(h, 1)
  }, [w, h])

  const updatePos = (axis: 'x' | 'y', v: number) =>
    updateElementPosition(element.id, { ...element.position, [axis]: v })

  const updateSize = (dim: 'w' | 'h', v: number) => {
    const newProps: Record<string, unknown> = {}
    if (dim === 'w') {
      newProps['style'] = {
        ...element.props.style,
        width: v,
        ...(lockRatio ? { height: Math.round(v / ratioRef.current) } : {}),
      }
      if ('width' in element.props) newProps['width'] = v
      if (lockRatio && 'height' in element.props)
        newProps['height'] = Math.round(v / ratioRef.current)
    } else {
      newProps['style'] = {
        ...element.props.style,
        height: v,
        ...(lockRatio ? { width: Math.round(v * ratioRef.current) } : {}),
      }
      if ('height' in element.props) newProps['height'] = v
      if (lockRatio && 'width' in element.props)
        newProps['width'] = Math.round(v * ratioRef.current)
    }
    updateElementProps(element.id, newProps)
  }

  const rotation = toNum(element.props.rotation, 0)
  const radius = toNum(element.props.style?.borderRadius, 0)

  return (
    <SectionHeader title="变换" collapsible defaultOpen>
      <div className="px-3 pt-2 space-y-2">
        {/* X / Y */}
        <div className="grid grid-cols-2 gap-2">
          <NumInput
            label="X"
            value={element.position.x}
            onChange={(v) => updatePos('x', v)}
          />
          <NumInput
            label="Y"
            value={element.position.y}
            onChange={(v) => updatePos('y', v)}
          />
        </div>
        {/* W / H + 锁定比例 */}
        <div className="flex items-end gap-1">
          <div className="grid grid-cols-2 gap-2 flex-1">
            <NumInput
              label="W"
              value={w}
              min={1}
              onChange={(v) => updateSize('w', v)}
            />
            <NumInput
              label="H"
              value={h}
              min={1}
              onChange={(v) => updateSize('h', v)}
            />
          </div>
          <button
            type="button"
            title={lockRatio ? '解锁比例' : '锁定比例'}
            onClick={() => setLockRatio((v) => !v)}
            className={cn(
              'w-6 h-6 flex items-center justify-center rounded mb-0.5 transition-colors shrink-0',
              lockRatio
                ? 'text-primary bg-primary/10'
                : 'text-text-tertiary hover:bg-fill-secondary',
            )}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {lockRatio ? (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </>
              ) : (
                <>
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </>
              )}
            </svg>
          </button>
        </div>
        {/* 旋转 / 圆角 */}
        <div className="grid grid-cols-2 gap-2">
          <NumInput
            label="旋转"
            value={rotation}
            unit="°"
            step={1}
            onChange={(v) => updateElementProps(element.id, { rotation: v })}
          />
          <NumInput
            label="圆角"
            value={radius}
            min={0}
            onChange={(v) =>
              updateElementProps(element.id, {
                style: { ...element.props.style, borderRadius: v },
              })
            }
          />
        </div>
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 3. 混合面板（不透明度 / 可见性 / 混合模式）
// ─────────────────────────────────────────────────────────
const BLEND_MODES = [
  '正常',
  '穿透',
  '正片叠底',
  '滤色',
  '叠加',
  '强光',
  '柔光',
  '差值',
  '颜色减淡',
  '颜色加深',
]

const BlendPanel: React.FC<{ element: CanvasElement }> = ({ element }) => {
  const opacity = toNum(
    element.props.opacity ?? element.props.style?.opacity,
    100,
  )
  const isHidden = element.props.visible === false
  const blendMode = element.props.blendMode ?? '正常'

  return (
    <SectionHeader title="图层混合" collapsible defaultOpen>
      <div className="px-3 pt-2 space-y-2">
        {/* 混合模式 + 可见性 */}
        <div className="flex items-center gap-2">
          <select
            value={blendMode}
            onChange={(e) =>
              updateElementProps(element.id, { blendMode: e.target.value })
            }
            className="flex-1 text-xs text-text bg-fill-secondary border border-transparent rounded px-2 py-1.5 outline-none hover:border-border focus:border-primary transition-colors"
          >
            {BLEND_MODES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <button
            type="button"
            title={isHidden ? '显示图层' : '隐藏图层'}
            onClick={() =>
              updateElementProps(element.id, { visible: !isHidden })
            }
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded transition-colors shrink-0',
              isHidden
                ? 'text-text-tertiary bg-fill-secondary'
                : 'text-text-secondary hover:bg-fill-secondary',
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {isHidden ? (
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
          </button>
        </div>
        {/* 不透明度 */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-tertiary w-12 shrink-0">
            不透明度
          </span>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={opacity}
            onChange={(e) =>
              updateElementProps(element.id, {
                opacity: Number(e.target.value),
                style: {
                  ...element.props.style,
                  opacity: Number(e.target.value) / 100,
                },
              })
            }
            className="flex-1 accent-primary h-1"
          />
          <div className="w-12 shrink-0">
            <NumInput
              label=""
              value={opacity}
              unit="%"
              min={0}
              onChange={(v) =>
                updateElementProps(element.id, {
                  opacity: Math.min(100, v),
                  style: {
                    ...element.props.style,
                    opacity: Math.min(100, v) / 100,
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 4. 填充面板
// ─────────────────────────────────────────────────────────
const FillPanel: React.FC<{ element: CanvasElement }> = ({ element }) => {
  const bg = element.props.style?.backgroundColor ?? ''

  const updateBg = (color: string) =>
    updateElementProps(element.id, {
      style: { ...element.props.style, backgroundColor: color },
    })

  return (
    <SectionHeader
      title="填充"
      collapsible
      defaultOpen
      action={<AddBtn onClick={() => updateBg('#E5E7EB')} title="添加填充" />}
    >
      <div className="px-3 pt-1 space-y-1.5">
        {bg ? (
          <div className="flex items-center gap-2">
            <ColorInput value={bg} onChange={updateBg} />
            <button
              type="button"
              title="移除填充"
              onClick={() => updateBg('')}
              className="w-5 h-5 flex items-center justify-center rounded text-text-tertiary hover:text-text hover:bg-fill-secondary transition-colors shrink-0"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-text-tertiary italic">无填充</p>
        )}
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 5. 描边面板
// ─────────────────────────────────────────────────────────
const STROKE_POSITIONS = ['内部', '居中', '外部'] as const

const StrokePanel: React.FC<{ element: CanvasElement }> = ({ element }) => {
  const borderColor = element.props.style?.borderColor ?? ''
  const borderWidth = toNum(element.props.style?.borderWidth, 1)
  const borderPos = element.props.strokePosition ?? '居中'

  const update = (patch: Record<string, unknown>) =>
    updateElementProps(element.id, {
      style: { ...element.props.style, ...patch },
    })

  const addStroke = () =>
    updateElementProps(element.id, {
      strokePosition: '居中',
      style: {
        ...element.props.style,
        borderColor: '#979797',
        borderWidth: 1,
        borderStyle: 'solid',
      },
    })

  const removeStroke = () =>
    updateElementProps(element.id, {
      style: {
        ...element.props.style,
        borderColor: '',
        borderWidth: 0,
        borderStyle: 'none',
      },
    })

  return (
    <SectionHeader
      title="描边"
      collapsible
      defaultOpen
      action={<AddBtn onClick={addStroke} title="添加描边" />}
    >
      <div className="px-3 pt-1 space-y-2">
        {borderColor ? (
          <>
            <div className="flex items-center gap-2">
              <ColorInput
                value={borderColor}
                onChange={(c) => update({ borderColor: c })}
              />
              <button
                type="button"
                title="移除描边"
                onClick={removeStroke}
                className="w-5 h-5 flex items-center justify-center rounded text-text-tertiary hover:text-text hover:bg-fill-secondary transition-colors shrink-0"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumInput
                label="粗细"
                value={borderWidth}
                min={0}
                onChange={(v) => update({ borderWidth: v })}
                unit="px"
              />
              <div className="flex flex-col gap-0.5">
                <label className="text-[10px] text-text-tertiary px-0.5">
                  位置
                </label>
                <select
                  value={borderPos}
                  onChange={(e) =>
                    updateElementProps(element.id, {
                      strokePosition: e.target.value,
                    })
                  }
                  className="bg-fill-secondary text-xs text-text rounded px-2 py-1.5 outline-none border border-transparent hover:border-border focus:border-primary transition-colors"
                >
                  {STROKE_POSITIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        ) : (
          <p className="text-[11px] text-text-tertiary italic">无描边</p>
        )}
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 6. 特效面板
// ─────────────────────────────────────────────────────────
type ShadowConfig = {
  x: number
  y: number
  blur: number
  spread: number
  color: string
  opacity: number
}

const defaultShadow = (): ShadowConfig => ({
  x: 2,
  y: 4,
  blur: 8,
  spread: 0,
  color: '#000000',
  opacity: 20,
})

const shadowToCSS = (s: ShadowConfig) => {
  const alpha = Math.round(s.opacity * 2.55)
    .toString(16)
    .padStart(2, '0')
  return `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}${alpha}`
}

const EffectsPanel: React.FC<{ element: CanvasElement }> = ({ element }) => {
  const shadow = element.props._shadow as ShadowConfig | undefined
  const blur = toNum(element.props._blur, 0)

  const updateShadow = (patch: Partial<ShadowConfig>) => {
    const next = { ...(shadow ?? defaultShadow()), ...patch }
    updateElementProps(element.id, {
      _shadow: next,
      style: { ...element.props.style, boxShadow: shadowToCSS(next) },
    })
  }

  const removeShadow = () =>
    updateElementProps(element.id, {
      _shadow: undefined,
      style: { ...element.props.style, boxShadow: 'none' },
    })

  const updateBlur = (v: number) =>
    updateElementProps(element.id, {
      _blur: v,
      style: {
        ...element.props.style,
        filter: v > 0 ? `blur(${v}px)` : 'none',
      },
    })

  return (
    <SectionHeader
      title="特效"
      collapsible
      defaultOpen={false}
      action={
        <div className="flex gap-1">
          <AddBtn title="添加阴影" onClick={() => updateShadow({})} />
        </div>
      }
    >
      <div className="px-3 pt-1 space-y-3">
        {/* 阴影 */}
        {shadow && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-secondary font-medium">
                阴影
              </span>
              <button
                type="button"
                onClick={removeShadow}
                className="text-[10px] text-text-tertiary hover:text-red transition-colors"
              >
                移除
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <NumInput
                label="X 偏移"
                value={shadow.x}
                onChange={(v) => updateShadow({ x: v })}
              />
              <NumInput
                label="Y 偏移"
                value={shadow.y}
                onChange={(v) => updateShadow({ y: v })}
              />
              <NumInput
                label="模糊"
                value={shadow.blur}
                min={0}
                onChange={(v) => updateShadow({ blur: v })}
              />
              <NumInput
                label="扩展"
                value={shadow.spread}
                onChange={(v) => updateShadow({ spread: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ColorInput
                label="颜色"
                value={shadow.color}
                onChange={(c) => updateShadow({ color: c })}
              />
              <NumInput
                label="透明度"
                value={shadow.opacity}
                min={0}
                onChange={(v) => updateShadow({ opacity: Math.min(100, v) })}
                unit="%"
              />
            </div>
          </div>
        )}
        {/* 模糊 */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-text-secondary w-12 shrink-0">
            高斯模糊
          </span>
          <div className="flex-1">
            <NumInput
              label=""
              value={blur}
              min={0}
              onChange={updateBlur}
              unit="px"
            />
          </div>
        </div>
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 7. 导出面板
// ─────────────────────────────────────────────────────────
const EXPORT_FORMATS = ['PNG', 'JPG', 'SVG', 'WebP'] as const
const EXPORT_SCALES = ['1x', '2x', '3x'] as const

const ExportPanel: React.FC<{ element: CanvasElement }> = ({ element }) => {
  const [format, setFormat] = useState<string>('PNG')
  const [scale, setScale] = useState<string>('1x')

  const handleExport = () => {
    // 在实际项目中接入导出逻辑
    alert(`导出 ${element.props.label || element.type} @ ${scale} / ${format}`)
  }

  return (
    <SectionHeader title="导出" collapsible defaultOpen={false}>
      <div className="px-3 pt-2 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-text-tertiary px-0.5">
              格式
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-fill-secondary text-xs text-text rounded px-2 py-1.5 outline-none border border-transparent hover:border-border focus:border-primary transition-colors"
            >
              {EXPORT_FORMATS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[10px] text-text-tertiary px-0.5">
              倍率
            </label>
            <select
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="bg-fill-secondary text-xs text-text rounded px-2 py-1.5 outline-none border border-transparent hover:border-border focus:border-primary transition-colors"
            >
              {EXPORT_SCALES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="w-full py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          导出切图
        </button>
      </div>
    </SectionHeader>
  )
}

// ─────────────────────────────────────────────────────────
// 主 PropsPanel
// ─────────────────────────────────────────────────────────
export const PropsPanel: React.FC<{ className?: string }> = ({ className }) => {
  const selectedElements = useSelectedElementsValue()
  const count = selectedElements.length

  // 空状态
  if (count === 0) {
    return (
      <aside
        className={cn(
          'fixed right-0 top-11 w-60 h-[calc(100vh-44px)] z-50 bg-bg-fill border-l border-border flex flex-col',
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-text-tertiary px-4 text-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4l3 3" />
          </svg>
          <p className="text-xs">选中图层以查看属性</p>
        </div>
      </aside>
    )
  }

  const el = selectedElements[0]

  return (
    <aside
      className={cn(
        'fixed right-0 top-11 w-60 h-[calc(100vh-44px)] z-50 bg-bg-fill border-l border-border flex flex-col overflow-y-auto',
        className,
      )}
    >
      {/* ── 顶部信息栏 ─────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-medium text-text truncate">
            {el.props.label || el.type}
          </span>
          {count > 1 && (
            <span className="text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 shrink-0">
              ×{count}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={deleteSelectedElements}
          title="删除选中图层"
          className="w-6 h-6 flex items-center justify-center rounded text-text-tertiary hover:bg-red/10 hover:text-red transition-colors shrink-0"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      {/* ── 章节内容 ───────────────────────────────── */}
      <div className="flex-1 min-h-0">
        {/* 1. 对齐 */}
        <AlignPanel count={count} />

        {/* 2. 变换（位置/尺寸/旋转/圆角）*/}
        <TransformPanel element={el} />

        {/* 3. 混合（不透明度/可见/混合模式）*/}
        <BlendPanel element={el} />

        {/* 4. 填充 */}
        <FillPanel element={el} />

        {/* 5. 描边 */}
        <StrokePanel element={el} />

        {/* 6. 特效 */}
        <EffectsPanel element={el} />

        {/* 7. 导出 */}
        <ExportPanel element={el} />
      </div>
    </aside>
  )
}
