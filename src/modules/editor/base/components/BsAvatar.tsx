import * as React from 'react'

import { cn } from '~/lib/cn'

type BsAvatarProps = {
  src?: string
  alt?: string
  size?: 'small' | 'medium' | 'large' | number
  text?: string
  className?: string
  style?: React.CSSProperties
}

export const BsAvatar: React.FC<BsAvatarProps> = ({
  src,
  alt = 'avatar',
  size = 48,
  text,
  className,
  style = {},
}) => {
  let sizeClass = ''
  if (typeof size === 'string') {
    const sizeClasses = {
      small: 'w-8 h-8 text-sm',
      medium: 'w-12 h-12 text-base',
      large: 'w-16 h-16 text-lg',
    }
    sizeClass = sizeClasses[size]
  }

  const computedStyle =
    typeof size === 'number'
      ? { width: `${size}px`, height: `${size}px`, ...style }
      : style

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-medium text-gray-500',
        sizeClass,
        className,
      )}
      style={computedStyle}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : text ? (
        <span>{text}</span>
      ) : null}
    </div>
  )
}
