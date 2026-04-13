# 左侧面板开发文档

> 版本：v1.0 | 更新日期：2026-04-13  
> 对应分支：`feature/mastergo`  
> 主入口：`src/modules/editor/VisualEditor.tsx`

---

## 一、整体定位

左侧面板是编辑器的核心操作区，承载**图层管理**与**资源选取**两大功能模块。  
面板固定在页面最左侧，垂直贯穿全屏，宽度默认固定（规划支持拖拽调整）。

### 当前实现文件

| 文件 | 说明 |
|------|------|
| `src/modules/editor/components/ComponentPanel.tsx` | 当前左侧面板（组件库）|
| `src/modules/editor/VisualEditor.tsx` | 编辑器布局入口，挂载面板 |
| `src/atoms/editor.ts` | 画布元素状态（图层数据来源）|
| `src/modules/editor/registry.tsx` | 组件注册表（资源面板数据来源）|

### 当前状态说明

> 当前左侧面板为 `ComponentPanel`（组件库拖拽面板），实现了组件搜索与分类展示。  
> 本文档描述完整目标设计，包括图层面板、资源面板、页面结构等全部区域，指导后续开发迭代。

---

## 二、区域划分总览

```
┌─────────────────────────────┐  ← 固定宽度侧边栏（默认 256px）
│  区域 1：顶部面包屑 + 标签栏   │
│  ┌─────────────────────────┐│
│  │ 草稿箱 / 积分签到         ││  面包屑
│  │ [图层]   [资源]          ││  切换标签
│  └─────────────────────────┘│
├─────────────────────────────┤
│  区域 2：图层工具栏            │  搜索 | 列表视图 | 新增 | 折叠
├─────────────────────────────┤
│  区域 3：页面结构分组栏        │  封面 / 页面 / 控件
├─────────────────────────────┤
│  区域 4：图层搜索框            │  🔍 搜索图层…
├─────────────────────────────┤
│                             │
│  区域 5：图层树主列表          │  ← 核心区域，垂直滚动
│  BODY-xxx                   │
│    排行榜备份                 │
│    排行榜                    │
│    补签成功                  │
│      连续 7 天签到            │
│      签到成功                 │
│    金币中心                  │
│                             │
├─────────────────────────────┤
│  区域 6：资源面板（Tab 切换）   │  组件 | 图片 | 图标 | 文本
│  来源筛选：所有团队库 / 本地    │
│  搜索框                      │
│  [卡片] [卡片]               │  两列网格
│  [卡片] [卡片]               │
│  ─────────────────────────  │
│  线框图 / Ant Design / MasterGo│  底部扩展
└─────────────────────────────┘
```

---

## 三、各区域详细说明

### 区域 1：顶部面包屑 + 标签栏

**位置**：侧边栏最顶端  
**规划组件文件**：`src/modules/editor/components/LeftPanel/PanelHeader.tsx`

#### 1.1 面包屑区域

| 属性 | 说明 |
|------|------|
| 位置 | 左上角 |
| 内容 | 草稿箱 / 积分签到（路径导航） |
| 交互 | 点击跳转对应模块 |

#### 1.2 图层 / 资源切换标签

| 属性 | 说明 |
|------|------|
| 选项 | 图层、资源 |
| 默认选中 | 图层 |
| 切换行为 | 隐藏/显示对应内容区（区域 2-5 vs 区域 6）|

**状态管理**（需新增 atom）：

```typescript
// src/atoms/editor.ts 中新增
type LeftPanelTab = 'layers' | 'resources'
const leftPanelTabAtom = atom<LeftPanelTab>('layers')
```

---

### 区域 2：图层模块顶部操作栏

**位置**：标签栏下方，横向通栏  
**规划组件文件**：`src/modules/editor/components/LeftPanel/LayerToolbar.tsx`

| 按钮 | 图标 | 功能说明 |
|------|------|----------|
| 搜索 | 🔍 | 展开/收起区域 4 的搜索输入框 |
| 列表视图 | ☰ | 切换图层显示模式（紧凑/展开）|
| 新增 | ＋ | 在当前选中位置新建图层 |
| 全部折叠 | ⊟ | 折叠图层树所有节点 |

**折叠操作实现参考**：

```typescript
// 折叠所有节点：清空展开状态
const collapseAll = () => setExpandedLayerIds([])

// 新增图层：调用现有 addCanvasElement
import { addCanvasElement } from '~/atoms/editor'
```

---

### 区域 3：页面结构分组栏

**位置**：操作栏下方，垂直分组列表  
**规划组件文件**：`src/modules/editor/components/LeftPanel/PageGroupList.tsx`

#### 分组结构示例

```
封面
├── 页面
├── 页面 4
├── 页面 5
└── 页面 6
控件
```

#### 数据结构设计

```typescript
type PageGroup = {
  id: string
  name: string           // 分组名称：封面 / 控件
  pages: PageItem[]
}

type PageItem = {
  id: string
  name: string           // 页面名称：页面、页面 4...
  isActive: boolean      // 当前激活页面
}
```

**状态管理**（需新增 atom）：

```typescript
// src/atoms/editor.ts 中新增
const pageGroupsAtom = atom<PageGroup[]>([])
const activePageIdAtom = atom<string | null>(null)
```

---

### 区域 4：图层搜索输入框

**位置**：分组栏下方，独立一行  
**规划组件文件**：内联于 `LayerPanel.tsx` 或独立 `LayerSearch.tsx`

| 属性 | 说明 |
|------|------|
| 占位文字 | 搜索图层… |
| 左侧图标 | 🔍 搜索图标 |
| 显示时机 | 点击区域 2 的搜索按钮时展开 |
| 过滤逻辑 | 实时过滤图层树，匹配图层名称 |

**过滤逻辑参考**（参照现有 `ComponentPanel.tsx:44`）：

```typescript
const filteredElements = canvasElements.filter(el =>
  el.props?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
  el.id.toLowerCase().includes(searchQuery.toLowerCase())
)
```

---

### 区域 5：图层树主列表区（核心区域）

**位置**：搜索框下方，占侧边栏最大高度，垂直可滚动  
**规划组件文件**：`src/modules/editor/components/LeftPanel/LayerTree.tsx`

#### 5.1 图层数据来源

图层数据来自 `src/atoms/editor.ts` 的 `canvasElementsAtom`，通过 `parentId` 字段构建树形结构。

```typescript
// 树形结构构建逻辑
const buildLayerTree = (elements: CanvasElement[]): LayerNode[] => {
  const roots = elements.filter(el => !el.parentId)
  return roots.map(el => ({
    ...el,
    children: elements.filter(child => child.parentId === el.id)
  }))
}
```

#### 5.2 实际项目图层示例

以下为项目中真实存在的图层结构（截取自签到/金币业务模块）：

```
BODY-xxx                    ← 根容器（Frame 类型）
  ├── 排行榜备份              ← 页面级 Group
  ├── 排行榜                 ← 页面级 Group
  ├── 补签成功               ← 页面级 Group
  │   ├── 连续 7 天签到       ← 子 Group
  │   └── 签到成功           ← 子 Group
  └── 金币中心               ← 页面级 Group
```

> 对应 `CanvasElement` 字段：`id`（如 `BODY-xxx`）、`type`（如 `frame`、`group`）、`props.label`（显示名称）、`parentId`（父子关系）

#### 5.3 图层节点交互

每个图层节点支持以下交互：

| 交互 | 实现位置 | 说明 |
|------|----------|------|
| 点击选中 | `setSelectedElementIds([id])` | 同步画布选中状态 |
| 眼睛图标（显/隐） | `updateElementProps(id, {visible: false})` | 控制渲染可见性 |
| 锁定图标 | `updateElementProps(id, {locked: true})` | 锁定后不可在画布操作 |
| 选中高亮 | 对比 `selectedElementIdsAtom` | 高亮样式区分 |
| 展开/折叠 | 本地 state `expandedIds` | 控制子节点显示 |
| 右键菜单 | 复用 Canvas 的 `contextMenu` 模式 | 编组/删除/层级操作 |

#### 5.4 相关 Atom 钩子（已有）

```typescript
import {
  useCanvasElementsValue,      // 获取所有元素
  useSelectedElementIdsValue,  // 获取选中 ID 列表
  useSetSelectedElementIds,    // 设置选中
  updateElementProps,          // 更新元素属性（显/隐/锁）
} from '~/atoms/editor'
```

---

### 区域 6：资源面板

**位置**：与图层面板同位置，点击「资源」标签切换显示  
**规划组件文件**：`src/modules/editor/components/LeftPanel/ResourcePanel.tsx`

#### 6.1 资源分类栏（顶部 Tab）

| 分类 | 数据来源 |
|------|----------|
| 组件 | `fullComponentRegistry`（`src/modules/editor/registry.tsx`）|
| 图片 | 待接入图片资源库 |
| 图标 | 待接入图标库（如 `BsIcon` 扩展）|
| 文本 | 预置文本样式列表 |

#### 6.2 资源来源筛选栏

```
所有团队库  |  本地
```

控制显示范围（团队共享资源 vs 本地上传资源）。

#### 6.3 资源搜索框

与区域 4 图层搜索框逻辑一致，过滤当前分类下的资源列表。

#### 6.4 资源卡片网格区

- 布局：两列卡片网格（`grid grid-cols-2 gap-2`）
- 卡片支持拖拽到画布（复用 `ComponentPanel.tsx:66` 的 `handleDragStart` 逻辑）

```typescript
// 复用现有拖拽逻辑
const handleDragStart = (e: React.DragEvent, componentId: string) => {
  e.dataTransfer.setData('componentId', componentId)
  e.dataTransfer.effectAllowed = 'copy'
}
```

#### 6.5 底部扩展组件库区

| 库名 | 说明 |
|------|------|
| 线框图组件 | 内置基础线框组件集 |
| Ant Design | 接入 Ant Design 组件库 |
| MasterGo Design | 接入 MasterGo 设计资产库 |

---

## 四、组件文件结构规划

```
src/modules/editor/components/LeftPanel/
├── index.tsx              ← 左侧面板容器（区域总组装）
├── PanelHeader.tsx        ← 区域 1：面包屑 + 图层/资源 Tab
├── LayerPanel.tsx         ← 区域 2-5：图层模块整体
│   ├── LayerToolbar.tsx   ← 区域 2：工具栏（搜索/视图/新增/折叠）
│   ├── PageGroupList.tsx  ← 区域 3：页面结构分组栏
│   ├── LayerSearch.tsx    ← 区域 4：图层搜索框
│   └── LayerTree.tsx      ← 区域 5：图层树列表（核心）
└── ResourcePanel.tsx      ← 区域 6：资源面板
```

---

## 五、状态管理扩展方案

在 `src/atoms/editor.ts` 中需新增以下 atom：

```typescript
// 左侧面板当前 Tab
type LeftPanelTab = 'layers' | 'resources'
const leftPanelTabAtom = atom<LeftPanelTab>('layers')

// 图层树展开节点 ID 集合
const expandedLayerIdsAtom = atom<string[]>([])

// 页面分组数据
const pageGroupsAtom = atom<PageGroup[]>([])

// 当前激活页面
const activePageIdAtom = atom<string | null>(null)

// 图层搜索关键词
const layerSearchQueryAtom = atom<string>('')

// 资源面板当前分类
type ResourceTab = 'components' | 'images' | 'icons' | 'text'
const resourceTabAtom = atom<ResourceTab>('components')
```

---

## 六、样式规范

参考现有 `ComponentPanel.tsx` 样式约定：

| 用途 | Tailwind 类 |
|------|-------------|
| 面板容器 | `fixed left-0 top-0 w-64 h-screen z-50` |
| 背景 | `bg-bg-fill` |
| 右侧边框 | `border-r border-border` |
| 内容滚动 | `overflow-y-auto` |
| 图层选中高亮 | `bg-bg-accent text-text` |
| 图层悬停 | `hover:bg-bg-accent` |
| 文字颜色 | `text-text` / `text-text-secondary` |
| 分割线 | `border-b border-border` |

---

## 七、关键交互流程

### 图层选中联动画布

```
点击图层树节点
  → useSetSelectedElementIds([id])
  → Canvas.tsx 中的 selectedElementIdsAtom 响应
  → 画布元素显示蓝色选中边框
  → PropsPanel.tsx 显示对应属性
```

### 拖拽组件到画布

```
区域 6 组件卡片 dragStart
  → e.dataTransfer.setData('componentId', id)
  → Canvas.tsx onDrop 接收
  → addCanvasElement() 添加新元素
  → 元素出现在放置位置
```

### 显示/隐藏图层

```
点击图层树眼睛图标
  → updateElementProps(id, { visible: !visible })
  → Canvas.tsx 渲染时检查 el.props.visible
  → 元素在画布上显示/隐藏
```

---

## 八、当前实现 vs 目标设计对比

| 区域 | 目标设计 | 当前状态 | 优先级 |
|------|----------|----------|--------|
| 区域 1：面包屑 + Tab | 图层/资源双 Tab | 仅有组件库标题 | P1 |
| 区域 2：图层工具栏 | 搜索/视图/新增/折叠 | 未实现 | P1 |
| 区域 3：页面分组栏 | 多页面结构目录 | 未实现 | P2 |
| 区域 4：图层搜索框 | 实时过滤图层 | 未实现 | P1 |
| 区域 5：图层树列表 | 多层级树形，支持显/隐/锁 | 未实现 | P0 |
| 区域 6：资源面板 | 组件/图片/图标/文本四 Tab | 仅有组件库（无 Tab 结构）| P1 |

---

## 九、参考实现路径

- **图层树参考**：`src/modules/editor/components/Canvas.tsx` — 元素渲染与选中逻辑
- **拖拽参考**：`src/modules/editor/components/ComponentPanel.tsx:66` — `handleDragStart`
- **状态参考**：`src/atoms/editor.ts` — 全部画布状态 atom 定义
- **组件数据参考**：`src/modules/editor/registry.tsx:322` — `fullComponentRegistry`
