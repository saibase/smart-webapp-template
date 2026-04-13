import * as React from 'react'

import { cn } from '~/lib/cn'

type BsUploadProps = {
  placeholder?: string
  onChange?: (files: File[]) => void
  multiple?: boolean
  accept?: string
  className?: string
}

export const BsUpload: React.FC<BsUploadProps> = ({
  placeholder = '点击上传文件',
  onChange,
  multiple = false,
  accept = 'image/*',
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    onChange?.(files)
  }

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-border rounded-md px-4 py-8 text-center hover:border-text transition-colors"
      >
        <svg
          className="mx-auto h-8 w-8 text-text-secondary mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="text-sm text-text-secondary">{placeholder}</div>
      </button>
    </div>
  )
}
