import * as React from 'react'

import { cn } from '~/lib/cn'

type BsSwiperProps = {
  images?: string[]
  height?: number
  borderRadius?: number
  className?: string
}

export const BsSwiper: React.FC<BsSwiperProps> = ({
  images = [
    'https://picsum.photos/800/400?random=1',
    'https://picsum.photos/800/400?random=2',
  ],
  height = 200,
  borderRadius = 8,
  className,
}) => {
  const [current, setCurrent] = React.useState(0)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${current * 100}%)`, height }}
      >
        {images.map((img, index) => (
          <div key={index} className="min-w-full">
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ borderRadius }}
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            type="button"
            key={index}
            className={`rounded-full transition-all ${
              current === index ? 'w-6 bg-text' : 'w-2 bg-text/40'
            } h-2`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}
