import * as React from 'react'

import { cn } from '~/lib/cn'

type TnAvatarProps = {
  src?: string
  alt?: string
  size?: 'small' | 'medium' | 'large'
  text?: string
  className?: string
}

export const TnAvatar: React.FC<TnAvatarProps> = ({
  src,
  alt = 'avatar',
  size = 'medium',
  text,
  className,
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-bg-fill-secondary flex items-center justify-center font-medium text-text',
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{text || '?'}</span>
      )}
    </div>
  )
}
