import * as React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu/context-menu'
import { cn } from '~/lib/cn'

// ─────────────────────────────────────────────────────────
// 模拟文件数据
// ─────────────────────────────────────────────────────────
type FileItem = {
  id: string
  name: string
  updatedAt: string
  isNew?: boolean
  color: string // 封面底色
  emoji: string // 封面图示
}

const MOCK_FILES: FileItem[] = [
  {
    id: '1',
    name: '积分签到 App',
    updatedAt: '1 小时前',
    isNew: true,
    color: '#6366f1',
    emoji: '✅',
  },
  {
    id: '2',
    name: '排行榜页面',
    updatedAt: '2 天前',
    color: '#f59e0b',
    emoji: '🏆',
  },
  {
    id: '3',
    name: '金币中心',
    updatedAt: '5 天前',
    color: '#10b981',
    emoji: '🪙',
  },
  {
    id: '4',
    name: '补签成功弹窗',
    updatedAt: '1 周前',
    color: '#ec4899',
    emoji: '📅',
  },
  {
    id: '5',
    name: '用户主页',
    updatedAt: '2 周前',
    color: '#3b82f6',
    emoji: '👤',
  },
  {
    id: '6',
    name: '新手引导流程',
    updatedAt: '3 周前',
    color: '#8b5cf6',
    emoji: '🎯',
  },
  {
    id: '7',
    name: '设置中心',
    updatedAt: '1 个月前',
    color: '#64748b',
    emoji: '⚙️',
  },
  {
    id: '8',
    name: '消息通知',
    updatedAt: '1 个月前',
    color: '#ef4444',
    emoji: '🔔',
  },
]

// ─────────────────────────────────────────────────────────
// 左侧导航项
// ─────────────────────────────────────────────────────────
type NavItem = {
  key: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '主页', icon: 'i-mingcute-home-4-line' },
  { key: 'drafts', label: '草稿箱', icon: 'i-mingcute-folder-line' },
  { key: 'shared', label: '分享给我的', icon: 'i-mingcute-share-forward-line' },
  { key: 'deleted', label: '最近删除', icon: 'i-mingcute-delete-2-line' },
]

// ─────────────────────────────────────────────────────────
// 文件封面卡片
// ─────────────────────────────────────────────────────────
type FileCardProps = {
  file: FileItem
  viewMode: 'grid' | 'list'
  onOpen: (id: string) => void
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  viewMode,
  onOpen,
  onRename,
  onDelete,
}) => {
  const [renaming, setRenaming] = useState(false)
  const [nameValue, setNameValue] = useState(file.name)

  const commitRename = () => {
    setRenaming(false)
    onRename(file.id)
  }

  if (viewMode === 'list') {
    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            onDoubleClick={() => onOpen(file.id)}
            className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-fill-secondary transition-colors group cursor-pointer"
          >
            {/* 小封面 */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-none"
              style={{ backgroundColor: `${file.color  }33` }}
            >
              {file.emoji}
            </div>
            <div className="flex-1 min-w-0">
              {renaming ? (
                <input
                  autoFocus
                  className="text-sm font-medium text-text bg-bg-fill border border-primary rounded px-1 outline-none w-full max-w-xs"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename()
                  }}
                />
              ) : (
                <p className="text-sm font-medium text-text truncate">
                  {file.name}
                </p>
              )}
              <p className="text-xs text-text-tertiary mt-0.5">
                更新于 {file.updatedAt}
              </p>
            </div>
            {file.isNew && (
              <span className="text-[10px] px-1.5 py-0.5 bg-primary/15 text-primary rounded font-medium">
                新文件
              </span>
            )}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                type="button"
                onClick={() => setRenaming(true)}
                className="p-1.5 rounded hover:bg-fill-tertiary text-text-secondary hover:text-text transition-colors"
                title="重命名"
              >
                <i className="i-mingcute-edit-line w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(file.id)}
                className="p-1.5 rounded hover:bg-red/10 text-text-secondary hover:text-red transition-colors"
                title="删除"
              >
                <i className="i-mingcute-delete-2-line w-4 h-4" />
              </button>
            </div>
          </div>
        </ContextMenuTrigger>
        <FileContextMenu
          file={file}
          onOpen={onOpen}
          onRename={() => setRenaming(true)}
          onDelete={onDelete}
        />
      </ContextMenu>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onDoubleClick={() => onOpen(file.id)}
          className="group flex flex-col rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer bg-bg-fill overflow-hidden"
        >
          {/* 封面区域 */}
          <div
            className="w-full aspect-video flex items-center justify-center relative"
            style={{ backgroundColor: `${file.color  }22` }}
          >
            <span className="text-3xl select-none">{file.emoji}</span>
            {file.isNew && (
              <span className="absolute top-2 left-2 text-[10px] px-1.5 py-0.5 bg-primary text-white rounded font-medium">
                新文件
              </span>
            )}
            {/* 悬浮操作按钮 */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setRenaming(true)
                }}
                className="p-1 rounded bg-bg-fill/90 hover:bg-bg-fill shadow text-text-secondary hover:text-text transition-colors"
                title="重命名"
              >
                <i className="i-mingcute-edit-line w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file.id)
                }}
                className="p-1 rounded bg-bg-fill/90 hover:bg-red/10 shadow text-text-secondary hover:text-red transition-colors"
                title="删除"
              >
                <i className="i-mingcute-delete-2-line w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 文件信息 */}
          <div className="px-3 py-2.5">
            {renaming ? (
              <input
                autoFocus
                className="text-sm font-medium text-text bg-bg-fill border border-primary rounded px-1 outline-none w-full"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename()
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-sm font-medium text-text truncate">
                {file.name}
              </p>
            )}
            <p className="text-xs text-text-tertiary mt-0.5">
              更新于 {file.updatedAt}
            </p>
          </div>
        </div>
      </ContextMenuTrigger>
      <FileContextMenu
        file={file}
        onOpen={onOpen}
        onRename={() => setRenaming(true)}
        onDelete={onDelete}
      />
    </ContextMenu>
  )
}

// ─────────────────────────────────────────────────────────
// 文件右键菜单
// ─────────────────────────────────────────────────────────
type FileContextMenuProps = {
  file: FileItem
  onOpen: (id: string) => void
  onRename: () => void
  onDelete: (id: string) => void
}

const FileContextMenu: React.FC<FileContextMenuProps> = ({
  file,
  onOpen,
  onRename,
  onDelete,
}) => (
  <ContextMenuContent className="min-w-[160px]">
    <ContextMenuItem onClick={() => onOpen(file.id)}>
      <i className="i-mingcute-external-link-line w-4 h-4 mr-2" />
      打开
    </ContextMenuItem>
    <ContextMenuItem onClick={onRename}>
      <i className="i-mingcute-edit-line w-4 h-4 mr-2" />
      重命名
    </ContextMenuItem>
    <ContextMenuItem>
      <i className="i-mingcute-copy-2-line w-4 h-4 mr-2" />
      复制
    </ContextMenuItem>
    <ContextMenuItem>
      <i className="i-mingcute-share-forward-line w-4 h-4 mr-2" />
      分享
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem
      onClick={() => onDelete(file.id)}
      className="text-red focus:text-red focus:bg-red/10"
    >
      <i className="i-mingcute-delete-2-line w-4 h-4 mr-2" />
      删除
    </ContextMenuItem>
  </ContextMenuContent>
)

// ─────────────────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────────────────
export const Component = () => {
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState<string>('drafts')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<string>('updated')
  const [searchQuery, setSearchQuery] = useState('')
  const [files, setFiles] = useState<FileItem[]>(MOCK_FILES)

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenFile = (id: string) => {
    const file = files.find((f) => f.id === id)
    navigate('/editor', { state: { fileName: file?.name ?? '未命名文件' } })
  }

  const handleNewFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: `未命名文件 ${files.length + 1}`,
      updatedAt: '刚刚',
      isNew: true,
      color: ['#6366f1', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'][
        files.length % 5
      ],
      emoji: ['📄', '🎨', '📱', '🖥️', '🗂️'][files.length % 5],
    }
    setFiles([newFile, ...files])
    navigate('/editor', { state: { fileName: newFile.name } })
  }

  const handleRenameFile = (_id: string) => {
    // 重命名由卡片内部 input 处理，这里可以做持久化
  }

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text">
      {/* ── 顶部导航栏 ────────────────────────────────── */}
      <header className="flex items-center h-14 px-4 border-b border-border gap-4 shrink-0">
        {/* Logo + 返回 */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <i className="i-mingcute-pentagon-line w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-text hidden sm:block">
            MasterGo
          </span>
        </div>

        {/* 全局搜索 */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-fill-secondary hover:border-primary/40 transition-colors focus-within:border-primary">
            <i className="i-mingcute-search-line w-4 h-4 text-text-tertiary shrink-0" />
            <input
              type="text"
              placeholder="搜索文件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-text placeholder:text-text-tertiary"
            />
          </div>
        </div>

        {/* 右侧操作 */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-secondary hover:text-text border border-border rounded-lg hover:bg-fill-secondary transition-colors"
          >
            <i className="i-mingcute-upload-2-line w-4 h-4" />
            <span className="hidden sm:block">导入文件</span>
          </button>
          <button
            type="button"
            onClick={handleNewFile}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <i className="i-mingcute-add-line w-4 h-4" />
            <span className="hidden sm:block">新建文件</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── 左侧导航栏 ────────────────────────────────── */}
        <aside className="w-52 shrink-0 border-r border-border flex flex-col gap-1 py-4 px-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveNav(item.key)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left w-full',
                activeNav === item.key
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
              )}
            >
              <i className={`${item.icon} w-4 h-4`} />
              {item.label}
            </button>
          ))}

          <div className="my-2 border-t border-border" />

          {/* 新建团队 */}
          <button
            type="button"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-fill-secondary hover:text-text transition-colors text-left w-full"
          >
            <i className="i-mingcute-add-circle-line w-4 h-4" />
            新建团队
          </button>

          {/* 个人空间入口 */}
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-fill-secondary hover:text-text transition-colors cursor-pointer">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                <i className="i-mingcute-user-3-line w-3.5 h-3.5 text-primary" />
              </div>
              <span className="truncate">个人空间</span>
            </div>
          </div>
        </aside>

        {/* ── 内容区 ────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          {/* 筛选 & 排序栏 */}
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 border-b border-border bg-background">
            <h2 className="text-sm font-semibold text-text">
              {NAV_ITEMS.find((n) => n.key === activeNav)?.label}
            </h2>
            <span className="text-xs text-text-tertiary">
              {filteredFiles.length} 个文件
            </span>

            <div className="ml-auto flex items-center gap-2">
              {/* 排序 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs text-text-secondary bg-fill-secondary border border-border rounded-lg px-2 py-1.5 outline-none hover:border-primary/40 transition-colors cursor-pointer"
              >
                <option value="updated">更新时间</option>
                <option value="name">文件名</option>
                <option value="type">文件类型</option>
              </select>

              {/* 视图切换 */}
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  title="网格视图"
                  className={cn(
                    'flex items-center justify-center w-8 h-8 transition-colors',
                    viewMode === 'grid'
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
                  )}
                >
                  <i className="i-mingcute-grid-line w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  title="列表视图"
                  className={cn(
                    'flex items-center justify-center w-8 h-8 transition-colors border-l border-border',
                    viewMode === 'list'
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-secondary hover:bg-fill-secondary hover:text-text',
                  )}
                >
                  <i className="i-mingcute-list-check-line w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-text-tertiary gap-3">
                <i className="i-mingcute-folder-open-line w-12 h-12 opacity-40" />
                <p className="text-sm">
                  暂无文件，点击右上角「新建文件」开始创作
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
                {/* 新建卡片 */}
                <button
                  type="button"
                  onClick={handleNewFile}
                  className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-text-tertiary hover:text-primary group"
                >
                  <i className="i-mingcute-add-circle-line w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">新建文件</span>
                </button>

                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    viewMode="grid"
                    onOpen={handleOpenFile}
                    onRename={handleRenameFile}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-1 max-w-3xl">
                {filteredFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    viewMode="list"
                    onOpen={handleOpenFile}
                    onRename={handleRenameFile}
                    onDelete={handleDeleteFile}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export const loader = undefined
export const handle = undefined
