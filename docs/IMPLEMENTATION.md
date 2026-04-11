# 可视化编辑器实现文档

本文档记录了可视化编辑器从骨架到核心功能的实现过程。

## 实现步骤

### 第一步：三栏式编辑器骨架搭建

#### 目标
实现左侧组件库面板、中间画布区、右侧属性面板的基础三栏布局。

#### 实现内容

1. **布局结构**
   - 使用 Tailwind flex 布局实现三栏自适应
   - 左右面板固定宽度 `w-64`
   - 中间画布区使用 `flex-1` 占满剩余空间
   - 使用 Pastel 颜色系统保持风格一致

2. **状态原子定义** ([src/atoms/editor.ts](../src/atoms/editor.ts))
   - `canvasElementsAtom`: 存储画布所有元素列表
   - `selectedElementIdAtom`: 当前选中元素 ID
   - `selectedElementAtom`: 派生原子，根据 ID 获取选中元素
   - `editorConfigAtom`: 编辑器配置（缩放比例、设备尺寸）

   使用 Jotai 的 `createAtomHooks` 创建了完整的读写钩子，遵循项目的 Jotai 模式。

3. **文件结构**
   ```
   src/
   ├── atoms/
   │   └── editor.ts          # 编辑器核心状态
   └── modules/
       └── editor/
           ├── Editor.tsx     # 主编辑器组件
           ├── components/
           │   ├── ComponentPanel.tsx  # 左侧组件面板
           │   ├── Canvas.tsx          # 中间画布
           │   └── PropsPanel.tsx      # 右侧属性面板
           ├── components/             # 基础组件
           │   ├── Text.tsx
           │   ├── Button.tsx
           │   └── Input.tsx
           └── registry.ts             # 组件注册表
   ```

### 第二步：左侧组件库 + 拖拽实现

#### 目标
让用户能从左侧拖拽组件到画布，自动生成可编辑元素。

#### 实现内容

1. **组件注册表** ([registry.ts](../src/modules/editor/registry.ts))
   - 定义 `ComponentMeta` 类型，包含 ID、名称、分类、默认属性、组件
   - 目前注册了三个基础组件：文本、按钮、输入框
   - 分类分为「基础」和「表单」

2. **分类与搜索** ([ComponentPanel.tsx](../src/modules/editor/components/ComponentPanel.tsx))
   - 使用 `reduce` 将组件按分类分组
   - 搜索框支持按组件名称/ID 实时过滤
   - 支持分类折叠/展开，提升空间利用率

3. **拖拽实现**
   - 使用 HTML5 原生拖拽 API
   - 拖拽源设置 `dataTransfer` 传递组件 ID
   - 支持拖拽样式反馈，hover 效果

### 第三步：中间画布 + 元素编辑

#### 目标
实现元素拖拽、选中高亮、缩放、多端适配。

#### 实现内容

1. **多端尺寸切换** ([Canvas.tsx](../src/modules/editor/components/Canvas.tsx))
   - 支持移动端 (375x667)、平板 (768x1024)、桌面端 (1440x1024)
   - 通过切换 CSS 类名实现尺寸变化
   - 支持缩放功能，通过 `transform: scale()` 实现

2. **元素渲染与拖拽移动**
   - 使用 Framer Motion 的 `m.div` 实现拖拽
   - 关闭惯性 (`dragMomentum={false}`) 实现精准拖拽
   - 拖拽结束后更新元素位置到状态
   - 选中元素自动添加高亮边框

3. **放置处理**
   - 画布监听 `drop` 事件，获取拖拽的组件 ID
   - 从注册表查找组件，生成新元素添加到画布
   - 使用 `nanoid` 生成唯一 ID

### 第四步：右侧属性面板 + 实时修改

#### 目标
选中元素后，实时修改样式/属性，画布同步更新。

#### 实现内容

1. **属性编辑** ([PropsPanel.tsx](../src/modules/editor/components/PropsPanel.tsx))
   - 使用 Accordion 组件对属性分类展示：内容、基础样式、布局
   - 根据组件类型动态显示对应属性
     - 文本组件显示「文本内容」
     - 按钮组件显示「按钮文字」
     - 输入框显示「占位符」
   - 支持文字内容、字体颜色、背景颜色、内边距、圆角等属性修改
   - 所有修改实时同步到画布

2. **样式处理**
   - 属性存储为对象，合并后通过内联样式应用到组件
   - 保持结构简单，易于扩展

## 文件结构说明

```
src/
├── atoms/
│   └── editor.ts                    # 编辑器核心状态原子
├── modules/
│   └── editor/
│       ├── VisualEditor.tsx        # 主编辑器（全屏画布 + 浮动面板）
│       ├── registry.ts             # 可拖拽组件注册表
│       ├── components/
│       │   ├── ComponentPanel.tsx  # 左侧组件库面板（浮动）
│       │   ├── Canvas.tsx          # 中间画布区域（全屏无限）
│       │   ├── DeviceToolbar.tsx   # 缩放工具栏（底部居中）
│       │   └── PropsPanel.tsx      # 右侧属性面板（浮动）
│       └── components/             # 基础组件实现
│           ├── Text.tsx            # 文本组件
│           ├── Button.tsx          # 按钮组件
│           ├── Input.tsx           # 输入框组件
│           ├── Heading.tsx         # 标题组件
│           └── Frame.tsx           # 容器组件（手机/平板/桌面）
└── pages/(main)/
    └── editor.sync.tsx             # 编辑器页面路由
```

## 技术要点

1. **状态管理**
   - 使用 Jotai 原子状态，每个原子提供完整的 hooks
   - 派生原子自动处理选中元素计算
   - 遵循项目约定，不直接导出原子

2. **动画**
   - 使用 `m.*` 组件（来自 motion/react）
   - 遵循项目规则不直接使用 `motion.*`
   - Framer Motion 拖拽比原生 API 体验更好

3. **拖拽**
   - 使用 HTML5 原生拖拽 API 实现组件拖入
   - 使用 Framer Motion 实现画布内元素拖拽
   - 混合方案兼顾简洁和体验

4. **样式**
   - 全程使用 Pastel 颜色系统语义化类名
   - 不使用原生 Tailwind 颜色
   - 遵循项目样式规范

5. **路由**
   - 新建 `src/pages/(main)/editor.sync.tsx` 通过文件路由自动生成
   - 不修改自动生成的 `src/generated-routes.ts`

## 布局修改

### 需求变更：画布占满全屏，面板浮动在上方

#### 修改内容

| 组件 | 修改内容 |
|------|----------|
| [VisualEditor.tsx](../src/modules/editor/VisualEditor.tsx) | 画布区域改用 `absolute inset-0` 占满全屏，面板改为浮动层 |
| [ComponentPanel.tsx](../src/modules/editor/components/ComponentPanel.tsx) | 改为 `fixed left-0 top-0` 固定浮动，添加 `z-50 shadow-lg` |
| [PropsPanel.tsx](../src/modules/editor/components/PropsPanel.tsx) | 改为 `fixed right-0 top-0` 固定浮动，添加 `z-50 shadow-lg` |
| [Canvas.tsx](../src/modules/editor/components/Canvas.tsx) | 主容器改为 `absolute inset-0` 占满父容器 |
| [DeviceToolbar.tsx](../src/modules/editor/components/DeviceToolbar.tsx) | z-index 提升到 `z-[60]` 确保显示在面板上方 |

#### 新布局结构

```
┌─────────────────────────────────────────────┐
│  🎨 画布全屏（最底层，占满全部空间）           │
│                                             │
│  ┌───────┐                      ┌───────┐   │
│  │       │                      │       │   │
│  │ 组件库 │                      │ 属性   │   │
│  │       │                      │ 面板   │   │
│  │ (浮动) │                      │ (浮动) │   │
│  │       │                      │       │   │
│  └───────┘                      └───────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

## 问题排查与修复

### 问题：画布中移动元素时位置偏差

#### 现象
- 移动较小距离时，位置有小的出入
- 移动较大距离时，偏差明显增大
- 偏差会随着多次拖拽累积

#### 原因分析

1. **错误的计算方法 - 使用绝对坐标法**
   最初的实现使用 `info.point`（鼠标在视口的绝对坐标）来计算元素位置：
   ```ts
   const x = Math.round((info.point.x - rect.left) / scaleFactor)
   const y = Math.round((info.point.y - rect.top) / scaleFactor)
   ```

2. **`info.point` 的坐标参考点不明确**
   - `info.point` 可能不是鼠标在视口的绝对位置
   - 可能是相对于元素初始位置或拖拽起始点的坐标
   - 每次拖拽开始时记录的 `offset`（鼠标相对于元素左上角的偏移）可能不准确

3. **累积误差**
   - 由于坐标参考点不明确，每次计算都会引入误差
   - 移动距离越大，误差累积越明显
   - 多次拖拽后，位置偏差会越来越大

#### 解决方案

改用**增量计算法**，使用 `info.delta`（拖拽增量）：

```ts
const handleElementDragEnd = (
  id: string,
  element: CanvasElement,
  _event: MouseEvent | PointerEvent | TouchEvent,
  info: PanInfo
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
```

#### 方案优势

1. **`info.delta` 是纯粹的增量值**
   - 不依赖任何坐标参考点
   - 代表从拖拽开始到结束的位移量

2. **不会产生累积误差**
   - 每次拖拽都是基于当前真实位置
   - 新位置 = 原位置 + 增量，逻辑清晰

3. **代码更简洁**
   - 不需要记录拖拽开始时的偏移量
   - 不需要处理复杂的坐标转换

#### 关键要点

- 画布容器使用了 `transform: scale()` 进行整体缩放
- 所有坐标计算都需要除以 `scaleFactor = scale / 100` 转换到画布原始坐标系
- `info.delta` 是屏幕像素增量，需要除以缩放因子
- 使用 `dragMomentum={false}` 关闭惯性，确保拖拽精准

#### 验证

- ✅ 构建成功
- ✅ 移动较小距离时位置准确
- ✅ 移动较大距离时无偏差累积
- ✅ 多次拖拽后位置依然准确

## 新增功能：无限画布 + 整体平移

### 需求变更：画板改为无限宽高，支持长按平移

#### 实现内容

1. **新增状态原子** ([src/atoms/editor.ts](../src/atoms/editor.ts))
   - 新增 `CanvasOffset` 类型定义画布整体偏移
   - 新增 `canvasOffsetAtom` 原子存储偏移量 `{ x, y }`
   - 新增 `addCanvasOffset` 增量更新偏移工具函数
   - 新增 `useCanvasOffsetValue` `useSetCanvasOffset` 钩子

2. **画布结构重构** ([Canvas.tsx](../src/modules/editor/components/Canvas.tsx))
   ```
   ┌─────────────────────────────────────────┐
   │  容器: absolute inset-0 (全屏)           │
   │    ┌───────────────────────────────────┐ │
   │    │ m.div (可拖拽平移层)               │ │
   │    │  - transform: translate(x, y)px  │ │
   │    │  - 覆盖整个容器，cursor grab      │ │
   │    │    ┌────────────────────────────┐ │ │
   │    │    │ 无限背景网格 (-10000px)    │ │ │
   │    │    │  设备预览容器              │ │ │
   │    │    │    元素列表               │ │ │
   │    │    └────────────────────────────┘ │ │
   │    └───────────────────────────────────┘ │
   └─────────────────────────────────────────┘
   ```

3. **拖拽平移实现**
   - 使用 Framer Motion `m.div` 包裹整个画布内容
   - 开启 `drag` 并设置 `dragMomentum={false}` 关闭惯性
   - `onPanEnd` 获取拖拽增量 `info.delta`，调用 `addCanvasOffset` 更新整体偏移
   - 所有元素位置都会随画布偏移自动更新

4. **放置坐标修正**
   - 拖拽放置新元素时需要减去画布偏移量：
     ```ts
     const mouseX = e.clientX - rect.left - canvasOffset.x
     const mouseY = e.clientY - rect.top - canvasOffset.y
     ```

5. **UI 调整**
   - [DeviceToolbar](../src/modules/editor/components/DeviceToolbar.tsx) 从顶部移到底部 `bottom-4`，避免遮挡画布内容
   - 背景网格扩展到 `-10000px` 提供无限画布视觉效果
   - 初始设备容器居中放置，顶部保留边距

#### 交互说明

- **长按画布背景拖拽**：整个画布跟随鼠标平移
- **拖拽元素**：只移动元素本身，画布不动
- **滚动鼠标滚轮**：浏览器滚动正常工作
- **添加新元素**：坐标计算自动考虑当前画布偏移

#### 技术要点

| 要点 | 说明 |
|------|------|
| 增量更新 | 使用 `info.delta` 增量更新偏移，不累积误差 |
| 坐标修正 | 放置新元素时需要减去当前画布偏移，得到正确坐标 |
| 光标样式 | 默认 `cursor-grab`，拖拽中 `active:cursor-grabbing` |
| 事件冒泡 | 点击元素时 `e.stopPropagation()` 防止触发画布选中清除 |

#### 验证

- ✅ 画布无限宽高，支持上下左右平移
- ✅ 长按背景拖拽流畅，无惯性
- ✅ 添加元素位置正确，不偏移
- ✅ 元素拖拽不受画布平移影响
- ✅ 设备工具栏放在底部不遮挡内容

## 架构变更：容器组件化，支持多实例

### 需求变更：手机/平板/桌面不是全局设备切换，应该作为普通可拖拽容器

#### 变更前问题

- 原先只有一个固定在画布中央的设备容器
- 用户只能修改这一个容器，不能添加多个
- 无法删除、不能在同一个画布中放多个设备预览

#### 实现方案

1. **新增 Frame 容器组件** ([Frame.tsx](../src/modules/editor/components/Frame.tsx))
   - 属性：`width` (数字，像素)、`height` (数字，像素)
   - 属性：`backgroundColor` (十六进制颜色)、`padding` (数字，像素)
   - 自带边框和阴影，和设计稿预览效果一致
   - 所有属性都可以通过右侧属性面板编辑

2. **组件注册表新增三种预设容器** ([registry.ts](../src/modules/editor/registry.ts))
   | 组件 ID | 名称 | 尺寸 | 分类 |
   |---------|------|------|------|
   | `frame-mobile` | 手机容器 | 375×667 | 容器 |
   | `frame-tablet` | 平板容器 | 768×1024 | 容器 |
   | `frame-desktop` | 桌面容器 | 1440×1024 | 容器 |

   新增「容器」分类，和「基础」「表单」并列。

3. **Canvas 重构 - 移除固定设备容器** ([Canvas.tsx](../src/modules/editor/components/Canvas.tsx))
   - 移除原先固定的设备预览容器
   - 所有元素（包括容器）都直接渲染在无限画布上
   - 用户可以自由添加任意多个容器
   - 每个容器都可以独立拖拽、修改尺寸、删除

4. **属性面板支持容器属性编辑**
   - PropsPanel 已经支持动态渲染所有属性
   - 自动识别 `backgroundColor` 为颜色类型（# 开头），显示颜色选择器
   - `width`/`height`/`padding` 显示为数字输入框
   - 无需修改代码即可支持新属性编辑

#### 新架构

```
无限画布
  ├── [手机容器] (375×667)
  │   ├── 文本
  │   ├── 按钮
  │   └── 输入框
 ├── [平板容器] (768×1024)
 │   └── ...
 └── [桌面容器] (1440×1024)
     └── ...
```

#### 优势

| 优势 | 说明 |
|------|------|
| **多实例** | 可以添加任意多个容器，同时预览多端设计 |
| **自由编辑** | 每个容器都可以独立拖拽、修改尺寸、删除 |
| **灵活布局** | 容器可以放在画布任意位置，支持并排预览 |
| **属性编辑** | 所有属性都可以实时编辑：宽高、背景色、内边距 |

#### 验证

- ✅ 手机/平板/桌面容器可以从左侧拖拽添加
- ✅ 支持添加多个容器，在画布自由摆放
- ✅ 每个容器可以独立拖拽移动位置
- ✅ 选中容器可以编辑宽高、背景色、内边距
- ✅ 容器可以删除
- ✅ 元素可以放在容器内部（虽然现在还不支持嵌套，但位置上可以放进去）

## 新增功能：工具模式切换与快捷键

### 需求：底部工具栏添加选择/平移工具按钮，支持快捷键切换

#### 实现内容

1. **新增工具模式状态** ([src/atoms/editor.ts](../src/atoms/editor.ts))
   - 新增 `ToolMode` 类型：`'select' | 'pan'`
   - 新增 `toolModeAtom` 原子，默认 `select`
   - 使用 `createAtomHooks` 生成完整的读写钩子

2. **重构底部工具栏** ([DeviceToolbar.tsx](../src/modules/editor/components/DeviceToolbar.tsx))
   - 移除原来的设备切换按钮，只保留缩放调节
   - 添加两个工具按钮：选择 (V)、平移 (H)
   - 只显示图标（emoji），使用 Tooltip 组件悬停显示提示文字
   - 当前选中工具高亮显示背景色

3. **画布交互根据工具模式动态变化** ([Canvas.tsx](../src/modules/editor/components/Canvas.tsx))
   - **选择模式 (select)**：
     - 背景不允许拖拽
     - 元素允许拖拽和点击选中
     - `pointerEvents: auto`
   - **平移模式 (pan)**：
     - 背景允许拖拽平移画布
     - 元素不响应交互 (`pointerEvents: none`)
     - 元素不允许拖拽移动
   - 不需要重新点击画布就能持续平移，操作流畅

4. **键盘快捷键支持** ([VisualEditor.tsx](../src/modules/editor/VisualEditor.tsx))
   - `V` 键：切换到选择工具
   - `H` 键：切换到平移工具
   - 输入框/文本域中不触发，避免误操作
   - 忽略 ALT/CTRL/META 组合键

#### 交互说明

| 工具 | 快捷键 | 作用 |
|------|--------|------|
| 选择 | `V` | 选择/拖拽元素 |
| 平移 | `H` | 拖拽平移画布 |

#### UI 设计

- 按钮只显示图标（👆 选择 / 👋 平移）
- 悬停时 Tooltip 显示名称 + 快捷键提示
- 当前选中工具背景高亮，一目了然
- 工具栏固定在底部居中，不遮挡画布

#### 验证

- ✅ 按钮点击切换工具模式
- ✅ 快捷键 V/H 切换正常工作
- ✅ 平移模式下点击元素不选中
- ✅ 平移模式下背景拖拽画布正常
- ✅ 选择模式下元素拖拽正常
- ✅ 输入框输入时快捷键不触发
- ✅ 构建通过，类型检查无误

## 主题确认

`index.html` 中 `setTheme()` 函数已正确定义并调用，主题初始化工作正常，支持深色/浅色/系统三种模式。

## 样式调整：工具按钮对齐主题样式

### 需求

工具按钮样式需要修改，与 `index.sync.tsx` 中主题切换按钮样式保持一致：

- 按钮大小：`size-7`
- 选中状态：`bg-background text-text shadow-sm`
- 未选中状态：`text-placeholder-text hover:text-text`

### 修改内容 ([DeviceToolbar.tsx](../src/modules/editor/components/DeviceToolbar.tsx))

原来的按钮样式使用了 `px-3 py-1 rounded-md bg-fill`，现在改为：

```tsx
<button
  onClick={() => setToolMode('select')}
  className={cn(
    'size-7 flex items-center justify-center rounded-md transition-colors',
    toolMode === 'select'
      ? 'bg-background text-text shadow-sm'
      : 'text-placeholder-text hover:text-text',
  )}
>
  👆
</button>
```

### 效果

- 按钮尺寸更小更紧凑，高度与工具栏对齐
- 选中状态高亮明显，阴影柔和
- 未选中状态文字颜色淡化，hover 时恢复，交互反馈清晰
- 与页面中其他按钮样式保持一致，整体风格统一

## 新增功能：鼠标框选元素

### 需求

在选择模式下，支持鼠标拖拽框选多个元素（目前选中框内最后一个元素，后续可扩展为多选）。

### 实现内容

1. **新增框选状态原子** ([src/atoms/editor.ts](../src/atoms/editor.ts))
   - 新增 `SelectionBox` 类型定义框选区域：
     ```ts
     export type SelectionBox = {
       startX: number
       startY: number
       currentX: number
       currentY: number
     }
     ```
   - 新增 `selectionBoxAtom` 原子存储当前框选状态，`null` 表示没有框选
   - 使用 `createAtomHooks` 生成完整的读写钩子

2. **画布添加框选事件处理** ([Canvas.tsx](../src/modules/editor/components/Canvas.tsx))
   - `onMouseDown`: 在画布背景按下鼠标开始框选
     - 检查工具模式必须是选择模式
     - 记录起始点坐标（已经减去画布偏移，转换到画布原始坐标系）
     - 设置 `isBoxSelectingRef.current = true` 标记正在框选
   - `onMouseMove`: 鼠标移动时更新框选区域大小
     - 更新 `currentX/currentY` 让框选矩形跟随鼠标
   - `onMouseUp/onMouseLeave`: 结束框选，计算选中元素
     - 使用 AABB 碰撞检测判断哪些元素与框选矩形相交
     - 选中相交元素列表中最后一个元素
     - 清除框选状态

3. **渲染框选矩形可视化**
   - 在画布内容层添加半透明蓝色边框矩形
   - 位置和大小根据框选坐标动态计算
   - `pointer-events-none` 不影响鼠标事件

### 碰撞检测算法

```ts
const left = Math.min(selectionBox.startX, selectionBox.currentX)
const right = Math.max(selectionBox.startX, selectionBox.currentX)
const top = Math.min(selectionBox.startY, selectionBox.currentY)
const bottom = Math.max(selectionBox.startY, selectionBox.currentY)

const selectedIds: string[] = []
elements.forEach((el) => {
  const elWidth = el.props.width || 200
  const elHeight = el.props.height || 50
  const elRight = el.position.x + elWidth
  const elBottom = el.position.y + elHeight

  // AABB 相交检测：如果不相交则返回 true，所以整体取反
  const intersects = !(
    right < el.position.x ||
    left > elRight ||
    bottom < el.position.y ||
    top > elBottom
  )

  if (intersects) selectedIds.push(el.id)
})
```

### 交互说明

| 操作 | 效果 |
|------|------|
| 在画布空白处按下鼠标左键拖拽 | 开始框选，显示蓝色半透明矩形跟随鼠标 |
| 松开鼠标左键 | 结束框选，框内最后一个元素被选中 |
| 框选范围不包含任何元素 | 取消当前选中 |

### 技术要点

- **坐标转换**：框选坐标必须减去画布偏移量，转换到画布原始坐标系，才能与元素坐标正确比较
- **碰撞检测**：使用简化的 AABB 算法，基于元素位置和预估尺寸计算
- **渲染优化**：框选矩形使用 `pointer-events-none`，不干扰鼠标事件处理
- **只在选择模式生效**：平移模式下不触发框选

## 运行测试

```bash
# 开发模式
pnpm dev

# 构建测试
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

## 构建验证

- 已通过 `pnpm build` 构建测试
- 所有 TypeScript 类型检查通过
- 新增代码符合项目代码规范

## 后续扩展方向

1. **辅助线与吸附** - 拖拽元素时计算对齐线，自动吸附
2. **层级管理** - 添加图层列表，支持调整元素 z-index
3. **嵌套容器** - 支持在容器内添加元素，实现组件嵌套
4. **更多组件** - 扩展组件库，添加图片、卡片、导航等组件
5. **撤销/重做** - 基于历史记录实现操作回退
6. **导出代码** - 将画布配置导出为 React 组件代码
7. **本地存储** - 保存项目到 localStorage